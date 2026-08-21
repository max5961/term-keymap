import { describe, test, expect } from "vitest";
import { ActionStore } from "../../src/stateful/ActionStore.js";
import type { Action } from "../../src/types.js";
import { InputState } from "../../src/stateful/InputState";
import { key } from "../../src/util/KeyMapBuilder.js";

describe("ActionStore w/o leader", () => {
    const a1: Action = { keymap: "<C-a>", name: "ctrl-a" };
    const a2: Action = { keymap: "<C-b>", name: "ctrl-b" };
    const a3: Action = { keymap: "<C-c>", name: "ctrl-c" };

    const store = new ActionStore([a1, a2, a3]);

    const ip = new InputState();

    test("remove a1", () => {
        store.removeAction(a1);

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([1]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), store);
        results.push(r.name);

        expect(results).toEqual([undefined, "ctrl-b"]);
    });

    test("re-add a1, remove a2", () => {
        store.addAction(a1);
        store.removeAction(a2);

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([1]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), store);
        results.push(r.name);

        expect(results).toEqual(["ctrl-a", undefined]);
    });

    test("use returned callback to remove action", () => {
        const remove = store.addAction({
            keymap: "<C-d>",
            name: "ctrl-d",
        });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([4]), store);
        results.push(r.name);

        remove();
        r = ip.process(Buffer.from([4]), store);
        results.push(r.name);

        expect(results).toEqual(["ctrl-d", undefined]);
    });

    test("ActionStore.clear() removes all actions", () => {
        const store = new ActionStore([
            { keymap: "<C-a>", name: "ctrl-a" },
            { keymap: "<C-b>", name: "ctrl-b" },
            { keymap: "<C-c>", name: "ctrl-c" },
        ]);

        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([1]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([3]), store);
        results.push(r.name);

        store.clear();

        r = ip.process(Buffer.from([1]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([3]), store);
        results.push(r.name);

        expect(results).toEqual([
            "ctrl-a",
            "ctrl-b",
            "ctrl-c",
            undefined,
            undefined,
            undefined,
        ]);
    });

    test("ActionStore works with keymaps from KeyMapBuilder", () => {
        const store = new ActionStore([
            { keymap: key.ctrl.input("a"), name: "ctrl-a" },
            { keymap: key.ctrl.input("b"), name: "ctrl-b" },
            { keymap: key.ctrl.input("c"), name: "ctrl-c" },
            { keymap: key.input("a"), name: "a" },
        ]);

        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([1]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([3]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([97]), store);
        results.push(r.name);

        expect(results).toEqual(["ctrl-a", "ctrl-b", "ctrl-c", "a"]);
    });
});
