import { describe, test, expect } from "vitest";
import { ActionStore } from "../../src/stateful/ActionStore.js";
import { Action } from "../../src/stateful/UserConfig";
import { InputState } from "../../src/stateful/InputState";

describe("ActionStore w/o leader", () => {
    const store = new ActionStore();

    const a1: Action = { keymap: "<C-a>", name: "ctrl-a" };
    const a2: Action = { keymap: "<C-b>", name: "ctrl-b" };
    const a3: Action = { keymap: "<C-c>", name: "ctrl-c" };

    store.subscribe(a1, a2, a3);

    const ip = new InputState();

    test("unsubscribe a1", () => {
        store.unsubscribe(a1);

        const actions = store.getActions();
        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([1]), actions);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), actions);
        results.push(r.name);

        expect(results).toEqual([undefined, "ctrl-b"]);
    });

    test("resubscribe a1, unsubscribe a2", () => {
        store.subscribe(a1);
        store.unsubscribe(a2);

        const actions = store.getActions();
        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([1]), actions);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), actions);
        results.push(r.name);

        expect(results).toEqual(["ctrl-a", undefined]);
    });

    test("store.pause()", () => {
        store.pause();

        const actions = store.getActions();
        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([1]), actions);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), actions);
        results.push(r.name);

        r = ip.process(Buffer.from([3]), actions);
        results.push(r.name);

        expect(results).toEqual([undefined, undefined, undefined]);
    });

    test("store.resume() and resubscribe a2", () => {
        store.resume();
        store.subscribe(a2);

        const actions = store.getActions();
        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([1]), actions);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), actions);
        results.push(r.name);

        r = ip.process(Buffer.from([3]), actions);
        results.push(r.name);

        expect(results).toEqual(["ctrl-a", "ctrl-b", "ctrl-c"]);
    });

    test("unsubscribe via callback", () => {
        const unsub = store.subscribe({
            keymap: "<C-d>",
            name: "ctrl-d",
        });

        const actionsSub = store.getActions();
        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([4]), actionsSub);
        results.push(r.name);

        unsub();
        const actionsUnsub = store.getActions();

        r = ip.process(Buffer.from([4]), actionsUnsub);
        results.push(r.name);

        expect(results).toEqual(["ctrl-d", undefined]);
    });
});
