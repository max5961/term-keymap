import { describe, expect, test } from "vitest";
import { CursedInputState } from "../../src/stateful/CursedInputState.js";
import { encodeMods } from "../helpers/encodeMods.js";
import { createKeymaps } from "../../src/stateful/createKeymaps.js";

describe("stateful", () => {
    test("previous input does not effect matches", () => {
        const ip = new CursedInputState(5);
        const dummy = createKeymaps([]);
        const real = createKeymaps([{ name: "foo", keymap: { input: "b" } }]);
        ip.process(Buffer.from([97]), dummy);
        ip.process(Buffer.from([97]), dummy);
        ip.process(Buffer.from([97]), dummy);
        ip.process(Buffer.from([97]), dummy);
        const match = ip.process(Buffer.from([98]), real);

        expect(match.name).toBe("foo");
    });

    test("Handles abc", () => {
        const ip = new CursedInputState(5);
        const keymap = createKeymaps([
            { name: "foo", keymap: { input: "abc" } },
        ]);

        const matches = [] as (string | undefined)[];

        let match = ip.process(Buffer.from([97]), keymap);
        matches.push(match.name);

        match = ip.process(Buffer.from([98]), keymap);
        matches.push(match.name);

        match = ip.process(Buffer.from([99]), keymap);
        matches.push(match.name);

        expect(matches).toEqual([undefined, undefined, "foo"]);
    });

    test("Shorter inputs take precedence", () => {
        const ip = new CursedInputState(5);
        const keymaps = createKeymaps([
            { name: "foo", keymap: { input: "abc" } },
            { name: "bar", keymap: { input: "ab" } },
            { name: "baz", keymap: { input: "a" } },
        ]);

        const matches = [] as (string | undefined)[];

        let match = ip.process(Buffer.from([97]), keymaps);
        matches.push(match.name);

        match = ip.process(Buffer.from([98]), keymaps);
        matches.push(match.name);

        match = ip.process(Buffer.from([99]), keymaps);
        matches.push(match.name);

        match = ip.process(Buffer.from([97]), keymaps);
        matches.push(match.name);

        expect(matches).toEqual(["baz", undefined, undefined, "baz"]);
    });

    test("Handles concatenation of flattened sequences", () => {
        const ip = new CursedInputState(10);
        const keymaps = createKeymaps([
            {
                name: "foo",
                keymap: [{ input: "abc" }, { input: "def" }],
            },
        ]);

        const matches = [] as (string | undefined)[];

        let match: ReturnType<typeof ip.process>;
        for (let i = 97; i < 103; ++i) {
            match = ip.process(Buffer.from([i]), keymaps);
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
        const ip = new CursedInputState(10);
        const keymaps = createKeymaps([
            {
                name: "foo",
                keymap: [{ input: "abc" }],
            },
        ]);

        const matches = [] as (string | undefined)[];

        let match: ReturnType<typeof ip.process>;
        for (let i = 97; i < 100; ++i) {
            ip.process(Buffer.from("\x1b[<35;1;1M"), keymaps); // mouse escape code

            match = ip.process(Buffer.from([i]), keymaps);
            matches.push(match.name);
        }
        expect(matches).toEqual([undefined, undefined, "foo"]);
    });

    test("Modifier only keys do not corrupt state (kitty shift only)", () => {
        const ip = new CursedInputState(10);
        const keymaps = createKeymaps([
            {
                name: "foo",
                keymap: [{ input: "abc" }],
            },
        ]);

        const matches = [] as (string | undefined)[];

        let match: ReturnType<typeof ip.process>;
        for (let i = 97; i < 100; ++i) {
            ip.process(Buffer.from("\x1b[57441u"), keymaps); // shift only

            match = ip.process(Buffer.from([i]), keymaps);
            matches.push(match.name);
        }
        expect(matches).toEqual([undefined, undefined, "foo"]);
    });

    describe("ambiguous legacy keycodes", () => {
        test("<C-i><C-i>", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "i" },
                        { key: "ctrl", input: "i" },
                    ],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<Tab><Tab>", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [{ key: "tab" }, { key: "tab" }],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-i><Tab> fails", () => {
            /**
             * This is impossible to match because CursedInputState creates compatible
             * paths based on the ambiguity of the buffer it receives.  For example,
             * because keycode 9 is ambiguous with Tab and Ctrl + i, the tree will
             * split at the leaf nodes and create two separate paths (if they don't
             * already exist).  Each path will interpret keycode 9 in one of the
             * two possible interpretations.  Therefore Ctrl + i cannot exist on the
             * same path as Tab.
             *
             * NOTE: The path only splits when an ambiguous *buffer* is
             * processed.  Kitty sends unambiguous buffers, so the Kitty protocol
             * allows for Ctrl + i and Tab to be on the same path.
             */
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [{ key: "ctrl", input: "i" }, { key: "tab" }],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined]);
        });
        test("<C-m><C-m>", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "m" },
                        { key: "ctrl", input: "m" },
                    ],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<CR><CR>", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [{ key: "return" }, { key: "return" }],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<CR><C-m> fails", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [{ key: "return" }, { key: "ctrl", input: "m" }],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined]);
        });
        test("<C-' '><C-' '>", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: " " },
                        { key: "ctrl", input: " " },
                    ],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-2><C-2>", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: " " },
                        { key: "ctrl", input: " " },
                    ],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-2><C-' '> fails", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "2" },
                        { key: "ctrl", input: " " },
                    ],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined]);
        });
        test("<Esc><Esc><Esc>", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [{ key: "esc" }, { key: "esc" }, { key: "esc" }],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<C-3><C-3><C-3>", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "3" },
                        { key: "ctrl", input: "3" },
                        { key: "ctrl", input: "3" },
                    ],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<C-[><C-[><C-[>", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [
                        { key: "ctrl", input: "[" },
                        { key: "ctrl", input: "[" },
                        { key: "ctrl", input: "[" },
                    ],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<Esc><C-3><C-[> fails", () => {
            const keymaps = createKeymaps([
                {
                    name: "foo",
                    keymap: [
                        { key: "esc" },
                        { key: "ctrl", input: "3" },
                        { key: "ctrl", input: "[" },
                    ],
                },
            ]);

            const ip = new CursedInputState(50);
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, undefined]);
        });
    });
});

describe("stateful", () => {
    const ip = new CursedInputState(50);

    const getKeymaps = () =>
        createKeymaps([
            {
                keymap: [{ key: "tab" }, { key: "tab" }],
                name: "TAB_TEST",
            },
        ]);

    describe("Legacy ambiguous", () => {
        test("double tab", () => {
            const keymaps = getKeymaps();
            ip.process(Buffer.from([9]), keymaps);
            const match = ip.process(Buffer.from([9]), keymaps);
            expect(match.name).toBe("TAB_TEST");
        });
    });

    describe("Kitty", () => {
        test("double tab /w previous ambiguous keys", () => {
            ip.clear();

            // Send ambiguous keycodes for Tab, Ctrl + i
            ip.process(Buffer.from([9]), createKeymaps([]));
            ip.process(Buffer.from([9]), createKeymaps([]));

            const keymaps = getKeymaps();

            // Send kitty CSI sequences for Tab (we already sent 2 unhandled for
            // keycode 9, so should match after just 1 kitty Tab)
            const match = ip.process(Buffer.from("\x1b[9u"), keymaps);
            expect(match.name).toBe("TAB_TEST");
        });

        test("double tab", () => {
            ip.clear();
            const keymaps = getKeymaps();
            ip.process(Buffer.from("\x1b[9u"), keymaps);
            const match = ip.process(Buffer.from("\x1b[9u"), keymaps);
            expect(match.name).toBe("TAB_TEST");
        });

        // prettier-ignore
        test("long sequence", () => {
            const keymap = createKeymaps([
                {
                    keymap: [
                        { key: ["super", "ctrl"], input: "Aa" },
                        { key: "alt", input: "ccc" },
                    ],
                    name: "foobar",
                },
            ]);

            // Load input state
            const dummy = createKeymaps([])
            ip.process(Buffer.from(`\x1b[97;${encodeMods(["super", "ctrl", "shift"])}u`), dummy);
            ip.process(Buffer.from(`\x1b[97;${encodeMods(["super", "ctrl"])}u`), dummy);
            ip.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`), dummy);
            ip.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`), dummy);

            // inject keymap on final <A-c>
            const match = 
                ip.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`), keymap);

            expect(match.name).toBe("foobar");
        });

        test("Sequence over size of input state fails", () => {
            const ip = new CursedInputState(5);

            const keymaps = createKeymaps([
                {
                    keymap: { input: "aaaaaa" },
                    name: "foobar",
                },
            ]);

            ip.process(Buffer.from("\x1b[97u"), keymaps);
            ip.process(Buffer.from("\x1b[97u"), keymaps);
            ip.process(Buffer.from("\x1b[97u"), keymaps);
            ip.process(Buffer.from("\x1b[97u"), keymaps);
            ip.process(Buffer.from("\x1b[97u"), keymaps);
            const match = ip.process(Buffer.from("\x1b[97u"), keymaps);

            expect(match.name).toBe(undefined);
        });

        test("Sequence same size of input state matches", () => {
            const ip = new CursedInputState(6);

            const keymaps = createKeymaps([
                {
                    keymap: { input: "aaaaaa" },
                    name: "foobar",
                },
            ]);

            ip.process(Buffer.from("\x1b[97u"), keymaps);
            ip.process(Buffer.from("\x1b[97u"), keymaps);
            ip.process(Buffer.from("\x1b[97u"), keymaps);
            ip.process(Buffer.from("\x1b[97u"), keymaps);
            ip.process(Buffer.from("\x1b[97u"), keymaps);
            const match = ip.process(Buffer.from("\x1b[97u"), keymaps);

            expect(match.name).toBe("foobar");
        });

        test("Smaller concats take precedence", () => {
            const keymaps = createKeymaps([
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

            let match = ip.process(Buffer.from("\x1b[97u"), keymaps);
            if (match.name) matches.push(match.name);

            match = ip.process(Buffer.from("\x1b[97u"), keymaps);
            if (match.name) matches.push(match.name);

            match = ip.process(Buffer.from("\x1b[97u"), keymaps);
            if (match.name) matches.push(match.name);

            expect(matches).toEqual(["baz", "baz", "baz"]);
        });
    });
});
