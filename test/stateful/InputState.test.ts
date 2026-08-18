import { describe, expect, test } from "vitest";
import { InputState } from "../../src/stateful/InputState.js";
import { encodeMods } from "../helpers/encodeMods.js";
import { KeyMap } from "../../src/types.js";
import { ActionStore } from "../../src/stateful/ActionStore.js";

describe("stateful legacy", () => {
    test("previous input does not effect matches", () => {
        const dummy = new ActionStore();
        const real = new ActionStore([{ name: "foo", keymap: { input: "b" } }]);
        const ip = new InputState({ maxDepth: 5 });
        ip.process(Buffer.from([97]), dummy);
        ip.process(Buffer.from([97]), dummy);
        ip.process(Buffer.from([97]), dummy);
        ip.process(Buffer.from([97]), dummy);
        const match = ip.process(Buffer.from([98]), real);

        expect(match.name).toBe("foo");
    });

    describe("disambiguates ambiguous xterm encodings", () => {
        const ip = new InputState();
        test.each([
            [[9], { key: "tab" }],
            [[9], { key: "ctrl", input: "i" }],
            [[13], { key: "return" }],
            [[13], { key: "ctrl", input: "m" }],
            [[0], { key: "ctrl", input: " " }],
            [[0], { key: "ctrl", input: "2" }],
            [[27], { key: "ctrl", input: "3" }],
            [[27], { key: "ctrl", input: "[" }],
            // esc itself does not allow combine with other keys
            // [[27], { key: "esc", input: "3" }],
            // [[27], { key: "esc", input: "[" }],
            [[28], { key: "ctrl", input: "4" }],
            [[28], { key: "ctrl", input: "\\" }],
            [[29], { key: "ctrl", input: "5" }],
            [[29], { key: "ctrl", input: "]" }],
            [[30], { key: "ctrl", input: "6" }],
            [[30], { key: "ctrl", input: "^" }],
            [[31], { key: "ctrl", input: "7" }],
            [[31], { key: "ctrl", input: "/" }],
            // backspace itself does not allow to combine with other keys (besides ctrl - see 0x08 )
            [[127], { key: "backspace" }],
            [[127], { key: "ctrl", input: "8" }],
            [[8], { key: ["ctrl", "backspace"] }],
            [[8], { key: "ctrl", input: "h" }],

            // same for adding an alt key
            [[27, 9], { key: ["alt", "tab"] }],
            [[27, 9], { key: ["alt", "ctrl"], input: "i" }],
            [[27, 13], { key: ["alt", "return"] }],
            [[27, 13], { key: ["alt", "ctrl"], input: "m" }],
            [[27, 0], { key: ["alt", "ctrl"], input: " " }],
            [[27, 0], { key: ["alt", "ctrl"], input: "2" }],
            [[27, 27], { key: ["alt", "ctrl"], input: "3" }],
            [[27, 27], { key: ["alt", "ctrl"], input: "[" }],
            [[27, 28], { key: ["alt", "ctrl"], input: "4" }],
            [[27, 28], { key: ["alt", "ctrl"], input: "\\" }],
            [[27, 29], { key: ["alt", "ctrl"], input: "5" }],
            [[27, 29], { key: ["alt", "ctrl"], input: "]" }],
            [[27, 30], { key: ["alt", "ctrl"], input: "6" }],
            [[27, 30], { key: ["alt", "ctrl"], input: "^" }],
            [[27, 31], { key: ["alt", "ctrl"], input: "7" }],
            [[27, 31], { key: ["alt", "ctrl"], input: "/" }],
            [[27, 127], { key: ["alt", "backspace"] }],
            [[27, 127], { key: ["alt", "ctrl"], input: "8" }],
            [[27, 8], { key: ["alt", "ctrl", "backspace"] }],
            [[27, 8], { key: ["alt", "ctrl"], input: "h" }],
        ])("%o => %o", (buf, keymap) => {
            const store = new ActionStore([
                { name: "foo", keymap: keymap as KeyMap },
            ]);

            const result = ip.process(Buffer.from(buf), store);
            expect(result.name).toBe("foo");
        });
    });

    test("Handles abc", () => {
        const ip = new InputState({ maxDepth: 5 });
        const store = new ActionStore([
            { name: "foo", keymap: { input: "abc" } },
        ]);
        const matches = [] as (string | undefined)[];

        let match = ip.process(Buffer.from([97]), store);
        matches.push(match.name);

        match = ip.process(Buffer.from([98]), store);
        matches.push(match.name);

        match = ip.process(Buffer.from([99]), store);
        matches.push(match.name);

        expect(matches).toEqual([undefined, undefined, "foo"]);
    });

    test("Shorter inputs take precedence", () => {
        const ip = new InputState({ maxDepth: 5 });
        const store = new ActionStore([
            { name: "foo", keymap: { input: "abc" } },
            { name: "bar", keymap: { input: "ab" } },
            { name: "baz", keymap: { input: "a" } },
        ]);

        const matches = [] as (string | undefined)[];

        let match = ip.process(Buffer.from([97]), store);
        matches.push(match.name);

        match = ip.process(Buffer.from([98]), store);
        matches.push(match.name);

        match = ip.process(Buffer.from([99]), store);
        matches.push(match.name);

        match = ip.process(Buffer.from([97]), store);
        matches.push(match.name);

        expect(matches).toEqual(["baz", undefined, undefined, "baz"]);
    });

    test("Handles concatenation of flattened sequences", () => {
        const ip = new InputState({ maxDepth: 50 });
        const store = new ActionStore([
            {
                name: "foo",
                keymap: [{ input: "abc" }, { input: "def" }],
            },
        ]);

        const matches = [] as (string | undefined)[];

        for (let i = 97; i < 103; ++i) {
            const match = ip.process(Buffer.from([i]), store);
            matches.push(match.name);
        }
        expect(matches).toEqual([
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "foo",
        ]);
    });

    test("Invalid sequences do not corrupt state (mouse CSI)", () => {
        const ip = new InputState({ maxDepth: 5 });
        const store = new ActionStore([
            {
                name: "foo",
                keymap: [{ input: "abc" }],
            },
        ]);

        const matches = [] as (string | undefined)[];

        let match: ReturnType<typeof ip.process>;
        for (let i = 97; i < 100; ++i) {
            ip.process(Buffer.from("\x1b[<35;1;1M"), store); // mouse escape code

            match = ip.process(Buffer.from([i]), store);
            matches.push(match.name);
        }
        expect(matches).toEqual([undefined, undefined, "foo"]);
    });

    test("Modifier only keys do not corrupt state (kitty shift only)", () => {
        const ip = new InputState({ maxDepth: 5 });
        const store = new ActionStore([
            {
                name: "foo",
                keymap: [{ input: "abc" }],
            },
        ]);

        const matches = [] as (string | undefined)[];

        let match: ReturnType<typeof ip.process>;
        for (let i = 97; i < 100; ++i) {
            ip.process(Buffer.from("\x1b[57441u"), store); // shift only

            match = ip.process(Buffer.from([i]), store);
            matches.push(match.name);
        }
        expect(matches).toEqual([undefined, undefined, "foo"]);
    });

    describe("ambiguous legacy keycodes", () => {
        test("<C-i><C-i>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "i" },
                        { key: "ctrl", input: "i" },
                    ],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([9]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([9]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<Tab><Tab>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [{ key: "tab" }, { key: "tab" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([9]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([9]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-i><Tab>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [{ key: "ctrl", input: "i" }, { key: "tab" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([9]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([9]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-m><C-m>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "m" },
                        { key: "ctrl", input: "m" },
                    ],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([13]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([13]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<CR><CR>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [{ key: "return" }, { key: "return" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([13]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([13]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<CR><C-m>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [{ key: "return" }, { key: "ctrl", input: "m" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([13]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([13]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-' '><C-' '>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: " " },
                        { key: "ctrl", input: " " },
                    ],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([0]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([0]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-2><C-2>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: " " },
                        { key: "ctrl", input: " " },
                    ],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([0]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([0]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-2><C-' '>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "2" },
                        { key: "ctrl", input: " " },
                    ],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([0]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([0]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<Esc><Esc><Esc>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [{ key: "esc" }, { key: "esc" }, { key: "esc" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<C-3><C-3><C-3>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "3" },
                        { key: "ctrl", input: "3" },
                        { key: "ctrl", input: "3" },
                    ],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<C-[><C-[><C-[>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "[" },
                        { key: "ctrl", input: "[" },
                        { key: "ctrl", input: "[" },
                    ],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<Esc><C-3><C-[>", () => {
            const store = new ActionStore([
                {
                    name: "foo",
                    keymap: [
                        { key: "esc" },
                        { key: "ctrl", input: "3" },
                        { key: "ctrl", input: "[" },
                    ],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), store);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
    });
});

describe("stateful kitty", () => {
    const ip = new InputState({ maxDepth: 50 });

    const getStore = () =>
        new ActionStore([
            {
                keymap: [{ key: "tab" }, { key: "tab" }],
                name: "TAB_TEST",
            },
        ]);

    const clear = () => {
        (ip as unknown as { clear: () => void }).clear();
    };

    test("double tab /w previous ambiguous keys", () => {
        clear();

        // Send ambiguous keycodes for Tab, Ctrl + i
        ip.process(Buffer.from([9]), new ActionStore([]));
        ip.process(Buffer.from([9]), new ActionStore([]));

        const store = getStore();

        // Send kitty CSI sequences for Tab (we already sent 2 unhandled for
        // keycode 9, so should match after just 1 kitty Tab)
        const match = ip.process(Buffer.from("\x1b[9u"), store);
        expect(match.name).toBe("TAB_TEST");
    });

    test("double tab", () => {
        clear();
        const store = getStore();
        ip.process(Buffer.from("\x1b[9u"), store);
        const match = ip.process(Buffer.from("\x1b[9u"), store);
        expect(match.name).toBe("TAB_TEST");
    });

    // prettier-ignore
    test("long sequence", () => {
            const store = new ActionStore([
                {
                    keymap: [
                        { key: ["super", "ctrl"], input: "Aa" },
                        { key: "alt", input: "ccc" },
                    ],
                    name: "foobar",
                },
            ]);

            // Load input state
            const dummy = new ActionStore([])
            ip.process(Buffer.from(`\x1b[97;${encodeMods(["super", "ctrl", "shift"])}u`),dummy);
            ip.process(Buffer.from(`\x1b[97;${encodeMods(["super", "ctrl"])}u`), dummy);
            ip.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`), dummy);
            ip.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`), dummy);

            // inject keymap on final <A-c>
            const match = 
                ip.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`), store);

            expect(match.name).toBe("foobar");
        });

    test("Sequence over size of input state fails with q size of 5", () => {
        const ip = new InputState({ maxDepth: 5 });

        const store = new ActionStore([
            {
                keymap: { input: "aaaaaa" },
                name: "foobar",
            },
        ]);

        ip.process(Buffer.from("\x1b[97u"), store);
        ip.process(Buffer.from("\x1b[97u"), store);
        ip.process(Buffer.from("\x1b[97u"), store);
        ip.process(Buffer.from("\x1b[97u"), store);
        ip.process(Buffer.from("\x1b[97u"), store);
        const match = ip.process(Buffer.from("\x1b[97u"), store);

        expect(match.name).toBe(undefined);
    });

    test("Sequence same size of q size and sequence len matches", () => {
        const ip = new InputState({ maxDepth: 6 });

        const store = new ActionStore([
            {
                keymap: { input: "aaaaaa" },
                name: "foobar",
            },
        ]);

        ip.process(Buffer.from("\x1b[97u"), store);
        ip.process(Buffer.from("\x1b[97u"), store);
        ip.process(Buffer.from("\x1b[97u"), store);
        ip.process(Buffer.from("\x1b[97u"), store);
        ip.process(Buffer.from("\x1b[97u"), store);
        const match = ip.process(Buffer.from("\x1b[97u"), store);

        expect(match.name).toBe("foobar");
    });

    test("Smaller concats take precedence", () => {
        const store = new ActionStore([
            {
                keymap: { input: "aaa" },
                name: "",
            },
            {
                keymap: { input: "aa" },
                name: "bar",
            },
            {
                keymap: { input: "a" },
                name: "baz",
            },
        ]);

        const matches: string[] = [];

        let match = ip.process(Buffer.from("\x1b[97u"), store);
        if (match.name) matches.push(match.name);

        match = ip.process(Buffer.from("\x1b[97u"), store);
        if (match.name) matches.push(match.name);

        match = ip.process(Buffer.from("\x1b[97u"), store);
        if (match.name) matches.push(match.name);

        expect(matches).toEqual(["baz", "baz", "baz"]);
    });
});
