import { describe, test, expect } from "vitest";
import { InputState } from "../../src/stateful/InputState";
import { ActionStore } from "../../src/stateful/ActionStore";
import { KeyMap } from "../../src/types";

describe("keymaps with leader using tokens", () => {
    const leader = { input: " " };
    const store = new ActionStore([
        {
            keymap: { leader: true, input: "foo" },
            name: "leader-foo",
        },
        {
            keymap: [{ leader: true }, { input: "bar" }],
            name: "leader-bar",
        },
        {
            keymap: [
                { leader: true },
                { input: "baz" },
                { leader: true, input: "baz" },
            ],
            name: "leader-baz-leader-baz",
        },
    ]);

    test("{ leader: true, input: 'foo' }", () => {
        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), store);
        results.push(r.name);

        r = ip.process(Buffer.from("f"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            "leader-foo",
        ]);
    });

    test("[ { leader: true }, { input: 'bar' }]", () => {
        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), store);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("r"), store);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            "leader-bar",
        ]);
    });

    test("[ { leader: true }, { input: 'baz' }, { leader: true, input: 'baz' }]", () => {
        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), store);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("z"), store);
        results.push(r.name);

        r = ip.process(Buffer.from(" "), store);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("z"), store);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "leader-baz-leader-baz",
        ]);
    });
});

describe("keymaps with leader using string keymaps", () => {
    const leader = { input: " " };
    const store = new ActionStore([
        {
            keymap: "<leader>foo",
            name: "leader-foo",
        },
        {
            keymap: "<leader>bar",
            name: "leader-bar",
        },
        {
            keymap: "<leader>baz<leader>baz",
            name: "leader-baz-leader-baz",
        },
    ]);

    test("<leader>foo", () => {
        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), store);
        results.push(r.name);

        r = ip.process(Buffer.from("f"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            "leader-foo",
        ]);
    });

    test("<leader>bar", () => {
        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), store);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("r"), store);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            "leader-bar",
        ]);
    });

    test("<leader>baz<leader>baz", () => {
        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), store);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("z"), store);
        results.push(r.name);

        r = ip.process(Buffer.from(" "), store);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("z"), store);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "leader-baz-leader-baz",
        ]);
    });
});

describe("leader other than space", () => {
    test("leader as { input: foo }", () => {
        const leader = { input: "foo" };
        const store = new ActionStore([
            {
                keymap: "bar",
                name: "bar",
            },
        ]);

        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from("f"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("r"), store);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "bar",
        ]);
    });

    test("modifiers without any counterparts cannot be leaders", () => {
        const leader: KeyMap = { key: "ctrl" };
        const store = new ActionStore([
            {
                keymap: "<leader>foo",
                name: "foo",
            },
        ]);

        // kitty-encoded buffers are the only way a modifier with no other keypresses can be recieved
        const ctrlBuffer = [27, 91, 53, 55, 52, 52, 50, 59, 49, 51, 51, 117];

        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(ctrlBuffer), store);
        results.push(r.name);

        r = ip.process(Buffer.from("f"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        expect(results).toEqual([undefined, undefined, undefined, undefined]);
    });

    test("leader as sequence of <A-a><C-a>", () => {
        const leader: KeyMap[] = [
            { key: "alt", input: "a" },
            { key: "ctrl", input: "a" },
        ];
        const store = new ActionStore([
            {
                keymap: "<leader>foo",
                name: "foo",
            },
        ]);

        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([27, 97]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([1]), store);
        results.push(r.name);

        r = ip.process(Buffer.from("f"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            undefined,
            "foo",
        ]);
    });
});

describe("can accept a leader argument in string form", () => {
    test("leader as <C-a><C-b>", () => {
        const leader = "<C-a><C-b>";
        const store = new ActionStore([
            {
                keymap: "<leader>foo",
                name: "foo",
            },
        ]);

        const ip = new InputState({ leader });

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([1]), store);
        results.push(r.name);

        r = ip.process(Buffer.from([2]), store);
        results.push(r.name);

        r = ip.process(Buffer.from("f"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), store);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            undefined,
            "foo",
        ]);
    });
});
