import { describe, expect, test } from "vitest";
import { InputState } from "../../src/stateful/InputState.js";
import { createActions } from "../../src/stateful/createActions.js";
import { encodeMods } from "../helpers/encodeMods.js";

describe("stateful legacy", () => {
    test("previous input does not effect matches", () => {
        const dummy = createActions([]);
        const real = createActions([{ name: "foo", keymap: { input: "b" } }]);
        const ip = new InputState({ maxDepth: 5 });
        ip.process(Buffer.from([97]), dummy);
        ip.process(Buffer.from([97]), dummy);
        ip.process(Buffer.from([97]), dummy);
        ip.process(Buffer.from([97]), dummy);
        const match = ip.process(Buffer.from([98]), real);

        expect(match.name).toBe("foo");
    });

    test("Handles abc", () => {
        const ip = new InputState({ maxDepth: 5 });
        const keymap = createActions([
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
        const ip = new InputState({ maxDepth: 5 });
        const keymaps = createActions([
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
        const ip = new InputState({ maxDepth: 50 });
        const keymaps = createActions([
            {
                name: "foo",
                keymap: [{ input: "abc" }, { input: "def" }],
            },
        ]);

        const matches = [] as (string | undefined)[];

        for (let i = 97; i < 103; ++i) {
            const match = ip.process(Buffer.from([i]), keymaps);
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
        const keymaps = createActions([
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
        const ip = new InputState({ maxDepth: 5 });
        const keymaps = createActions([
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
            const keymaps = createActions([
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

            let match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<Tab><Tab>", () => {
            const keymaps = createActions([
                {
                    name: "foo",
                    keymap: [{ key: "tab" }, { key: "tab" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-i><Tab>", () => {
            const keymaps = createActions([
                {
                    name: "foo",
                    keymap: [{ key: "ctrl", input: "i" }, { key: "tab" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([9]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-m><C-m>", () => {
            const keymaps = createActions([
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

            let match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<CR><CR>", () => {
            const keymaps = createActions([
                {
                    name: "foo",
                    keymap: [{ key: "return" }, { key: "return" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<CR><C-m>", () => {
            const keymaps = createActions([
                {
                    name: "foo",
                    keymap: [{ key: "return" }, { key: "ctrl", input: "m" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
            const matches = [] as (string | undefined)[];

            let match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([13]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-' '><C-' '>", () => {
            const keymaps = createActions([
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

            let match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-2><C-2>", () => {
            const keymaps = createActions([
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

            let match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-2><C-' '>", () => {
            const keymaps = createActions([
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

            let match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([0]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<Esc><Esc><Esc>", () => {
            const keymaps = createActions([
                {
                    name: "foo",
                    keymap: [{ key: "esc" }, { key: "esc" }, { key: "esc" }],
                },
            ]);

            const ip = new InputState({ maxDepth: 50 });
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
            const keymaps = createActions([
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

            let match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<C-[><C-[><C-[>", () => {
            const keymaps = createActions([
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

            let match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<Esc><C-3><C-[>", () => {
            const keymaps = createActions([
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

            let match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            match = ip.process(Buffer.from([27]), keymaps);
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
    });
});

describe("stateful kitty", () => {
    const ip = new InputState({ maxDepth: 50 });

    const getKeymaps = () =>
        createActions([
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
        ip.process(Buffer.from([9]), createActions([]));
        ip.process(Buffer.from([9]), createActions([]));

        const keymaps = getKeymaps();

        // Send kitty CSI sequences for Tab (we already sent 2 unhandled for
        // keycode 9, so should match after just 1 kitty Tab)
        const match = ip.process(Buffer.from("\x1b[9u"), keymaps);
        expect(match.name).toBe("TAB_TEST");
    });

    test("double tab", () => {
        clear();
        const keymaps = getKeymaps();
        ip.process(Buffer.from("\x1b[9u"), keymaps);
        const match = ip.process(Buffer.from("\x1b[9u"), keymaps);
        expect(match.name).toBe("TAB_TEST");
    });

    // prettier-ignore
    test("long sequence", () => {
            const keymaps = createActions([
                {
                    keymap: [
                        { key: ["super", "ctrl"], input: "Aa" },
                        { key: "alt", input: "ccc" },
                    ],
                    name: "foobar",
                },
            ]);

            // Load input state
            const dummy = createActions([])
            ip.process(Buffer.from(`\x1b[97;${encodeMods(["super", "ctrl", "shift"])}u`),dummy);
            ip.process(Buffer.from(`\x1b[97;${encodeMods(["super", "ctrl"])}u`), dummy);
            ip.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`), dummy);
            ip.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`), dummy);

            // inject keymap on final <A-c>
            const match = 
                ip.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`), keymaps);

            expect(match.name).toBe("foobar");
        });

    test("Sequence over size of input state fails with q size of 5", () => {
        const ip = new InputState({ maxDepth: 5 });

        const keymaps = createActions([
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

    test("Sequence same size of q size and sequence len matches", () => {
        const ip = new InputState({ maxDepth: 6 });

        const keymaps = createActions([
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
        const keymaps = createActions([
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
