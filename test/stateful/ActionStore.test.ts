import { describe, test, expect } from "vitest";
import { ActionStore } from "../../src/stateful/ActionStore.js";
import type { Action } from "../../src/types.js";
import { InputState } from "../../src/stateful/InputState";

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
});
