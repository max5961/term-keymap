import { describe, test, expect } from "vitest";
import { createActionsWithLeader } from "../../src/stateful/createActions";
import { InputState } from "../../src/stateful/InputState";

describe("keymaps with leader using tokens", () => {
    const actions = createActionsWithLeader({ input: " " })([
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
        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("f"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            "leader-foo",
        ]);
    });

    test("[ { leader: true }, { input: 'bar' }]", () => {
        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("r"), actions);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            "leader-bar",
        ]);
    });

    test("[ { leader: true }, { input: 'baz' }, { leader: true, input: 'baz' }]", () => {
        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("z"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from(" "), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("z"), actions);
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
    const actions = createActionsWithLeader({ input: " " })([
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
        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("f"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            "leader-foo",
        ]);
    });

    test("<leader>bar", () => {
        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("r"), actions);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            "leader-bar",
        ]);
    });

    test("<leader>baz<leader>baz", () => {
        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("z"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from(" "), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("z"), actions);
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
        const actions = createActionsWithLeader({ input: "foo" })([
            {
                keymap: "bar",
                name: "bar",
            },
        ]);

        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from("f"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("b"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("a"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("r"), actions);
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

    test("leader as <C-b>", () => {
        const actions = createActionsWithLeader({ key: "ctrl" })([
            {
                keymap: "foo",
                name: "foo",
            },
        ]);

        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from([2]), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("f"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        expect(results).toEqual([undefined, undefined, undefined, "foo"]);
    });
});
