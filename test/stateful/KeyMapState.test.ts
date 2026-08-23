import { describe, expect, test } from "vitest";
import { key, KeyMapState } from "../../src/index.js";
import { encodeMods } from "../helpers/encodeMods.js";
import { KeyMap } from "../../src/types.js";
import { InputState } from "../../src/stateful/InputState.js";
import { ActionStore } from "../../src/stateful/ActionStore.js";

describe("KeyMapState", () => {
    describe("ActionStore API", () => {
        test("ActionStore.addAction", () => {
            const state = new KeyMapState();
            state.addAction({ name: "foo", keymap: { input: "a" } });
            const match = state.process(Buffer.from([97]));
            expect(match.name).toBe("foo");
        });

        test("ActionStore.removeAction", () => {
            const state = new KeyMapState();
            const action = { name: "foo", keymap: { input: "a" } };

            state.addAction(action);
            state.removeAction(action);

            const match = state.process(Buffer.from([97]));
            expect(match.name).toBe(undefined);
        });

        test("ActionStore.removeAction with callback", () => {
            const state = new KeyMapState();
            const action = { name: "foo", keymap: { input: "a" } };

            const remove = state.addAction(action);
            remove();

            const match = state.process(Buffer.from([97]));
            expect(match.name).toBe(undefined);
        });

        test("ActionStore.addAction same action twice", () => {
            const state = new KeyMapState();
            const action = { name: "foo", keymap: { input: "a" } };
            state.addAction(action);
            state.addAction(action);
            expect(state.__store.getSortedActions().length).toBe(1);
        });

        test("ActionStore add actions in constructor", () => {
            const state = new KeyMapState({
                actions: [{ name: "foo", keymap: { input: "a" } }],
            });

            const match = state.process(Buffer.from([97]));
            expect(match.name).toBe("foo");
        });

        test("ActionStore.clearActions", () => {
            const state = new KeyMapState();
            state.addAction({ name: "foo", keymap: { input: "a" } });
            state.addAction({ name: "bar", keymap: { input: "b" } });

            const matches: (string | undefined)[] = [];
            let result = state.process(Buffer.from([97]));
            matches.push(result.name);
            result = state.process(Buffer.from([98]));
            matches.push(result.name);

            state.clearActions();

            result = state.process(Buffer.from([97]));
            matches.push(result.name);
            result = state.process(Buffer.from([98]));
            matches.push(result.name);

            expect(matches).toEqual(["foo", "bar", undefined, undefined]);
        });

        test("ActionStore.getSortedActions", () => {
            const state = new KeyMapState();
            state.addAction({ keymap: { input: "foo" } });
            state.addAction({ keymap: { input: "ba" } });
            state.addAction({ keymap: { input: "r" } });

            expect(state.__store.getSortedActions()).toEqual([
                { keymap: [{ input: "r" }] },
                { keymap: [{ input: "b" }, { input: "a" }] },
                { keymap: [{ input: "f" }, { input: "o" }, { input: "o" }] },
            ]);
        });
    });

    test("checks newest input first", () => {
        const state = new KeyMapState();
        state.addAction({ name: "a", keymap: { input: "a" } });
        state.addAction({ name: "b", keymap: { input: "b" } });
        state.process(Buffer.from([97]));
        state.process(Buffer.from([97]));
        state.process(Buffer.from([97]));
        state.process(Buffer.from([97]));
        const match = state.process(Buffer.from([98]));

        expect(match.name).toBe("b");
    });

    test("Handles keymap input length > 1", () => {
        const state = new KeyMapState();
        state.addAction({ name: "foo", keymap: { input: "abc" } });

        const matches = [] as (string | undefined)[];

        let match = state.process(Buffer.from([97]));
        matches.push(match.name);

        match = state.process(Buffer.from([98]));
        matches.push(match.name);

        match = state.process(Buffer.from([99]));
        matches.push(match.name);

        expect(matches).toEqual([undefined, undefined, "foo"]);
    });

    test("KeyMaps are checked based on their expanded sequence length, not insertion order", () => {
        const state = new KeyMapState();
        state.addAction({ name: "abc", keymap: { input: "abc" } });
        state.addAction({ name: "ab", keymap: { input: "ab" } });
        state.addAction({ name: "a", keymap: { input: "a" } });

        const matches = [] as (string | undefined)[];

        let match = state.process(Buffer.from([97]));
        matches.push(match.name);

        match = state.process(Buffer.from([98]));
        matches.push(match.name);

        match = state.process(Buffer.from([99]));
        matches.push(match.name);

        match = state.process(Buffer.from([97]));
        matches.push(match.name);

        expect(matches).toEqual(["a", undefined, undefined, "a"]);
    });

    test("Handles concatenation of flattened sequences", () => {
        const state = new KeyMapState();
        state.addAction({
            name: "foo",
            keymap: [{ input: "abc" }, { input: "def" }],
        });

        const matches = [] as (string | undefined)[];

        for (let i = 97; i < 103; ++i) {
            const match = state.process(Buffer.from([i]));
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
    test("Sequence over the size of the configured maxDepth fails", () => {
        const state = new KeyMapState({
            maxDepth: 5,
        });
        state.addAction({
            keymap: { input: "aaaaaa" },
            name: "foobar",
        });

        state.process(Buffer.from("\x1b[97u"));
        state.process(Buffer.from("\x1b[97u"));
        state.process(Buffer.from("\x1b[97u"));
        state.process(Buffer.from("\x1b[97u"));
        state.process(Buffer.from("\x1b[97u"));
        const match = state.process(Buffer.from("\x1b[97u"));

        expect(match.name).toBe(undefined);
    });

    test("Sequence same size of maxDepth matches", () => {
        const state = new KeyMapState({ maxDepth: 6 });
        state.addAction({
            keymap: { input: "aaaaaa" },
            name: "foobar",
        });

        state.process(Buffer.from("\x1b[97u"));
        state.process(Buffer.from("\x1b[97u"));
        state.process(Buffer.from("\x1b[97u"));
        state.process(Buffer.from("\x1b[97u"));
        state.process(Buffer.from("\x1b[97u"));
        const match = state.process(Buffer.from("\x1b[97u"));

        expect(match.name).toBe("foobar");
    });

    describe.skip("disambiguates ambiguous xterm encodings", () => {
        const state = new KeyMapState();
        // prettier-ignore
        test.each([
            [[9],       { key: "tab" }],
            [[9],       { key: "ctrl", input: "i" }],
            [[13],      { key: "return" }],
            [[13],      { key: "ctrl", input: "m" }],
            [[0],       { key: "ctrl", input: " " }],
            [[0],       { key: "ctrl", input: "2" }],
            [[27],      { key: "ctrl", input: "3" }],
            [[27],      { key: "ctrl", input: "[" }],
            // esc itself does not allow combine with other keys
            // [[27], { key: "esc", input: "3" }],
            // [[27], { key: "esc", input: "[" }],
            [[28],      { key: "ctrl", input: "4" }],
            [[28],      { key: "ctrl", input: "\\" }],
            [[29],      { key: "ctrl", input: "5" }],
            [[29],      { key: "ctrl", input: "]" }],
            [[30],      { key: "ctrl", input: "6" }],
            [[30],      { key: "ctrl", input: "^" }],
            [[31],      { key: "ctrl", input: "7" }],
            [[31],      { key: "ctrl", input: "/" }],
            // backspace itself does not allow to combine with other keys (besides ctrl - see 0x08 )
            [[127],     { key: "backspace" }],
            [[127],     { key: "ctrl", input: "8" }],
            [[8],       { key: ["ctrl", "backspace"] }],
            [[8],       { key: "ctrl", input: "h" }],

            // same for adding an alt key
            [[27, 9],   { key: ["alt", "tab"] }],
            [[27, 9],   { key: ["alt", "ctrl"], input: "i" }],
            [[27, 13],  { key: ["alt", "return"] }],
            [[27, 13],  { key: ["alt", "ctrl"], input: "m" }],
            [[27, 0],   { key: ["alt", "ctrl"], input: " " }],
            [[27, 0],   { key: ["alt", "ctrl"], input: "2" }],
            [[27, 27],  { key: ["alt", "ctrl"], input: "3" }],
            [[27, 27],  { key: ["alt", "ctrl"], input: "[" }],
            [[27, 28],  { key: ["alt", "ctrl"], input: "4" }],
            [[27, 28],  { key: ["alt", "ctrl"], input: "\\" }],
            [[27, 29],  { key: ["alt", "ctrl"], input: "5" }],
            [[27, 29],  { key: ["alt", "ctrl"], input: "]" }],
            [[27, 30],  { key: ["alt", "ctrl"], input: "6" }],
            [[27, 30],  { key: ["alt", "ctrl"], input: "^" }],
            [[27, 31],  { key: ["alt", "ctrl"], input: "7" }],
            [[27, 31],  { key: ["alt", "ctrl"], input: "/" }],
            [[27, 127], { key: ["alt", "backspace"] }],
            [[27, 127], { key: ["alt", "ctrl"], input: "8" }],
            [[27, 8],   { key: ["alt", "ctrl", "backspace"] }],
            [[27, 8],   { key: ["alt", "ctrl"], input: "h" }],
        ])("%o => %o", (buf, keymap) => {
            state.clearActions();
            state.addAction({ name: "foo", keymap: keymap as KeyMap });

            const result = state.process(Buffer.from(buf));
            expect(result.name).toBe("foo");
        });
    });

    describe.skip("ambiguous legacy keycodes", () => {
        test("<C-i><C-i>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [
                    { key: "ctrl", input: "i" },
                    { key: "ctrl", input: "i" },
                ],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([9]));
            matches.push(match.name);

            match = state.process(Buffer.from([9]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<Tab><Tab>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [{ key: "tab" }, { key: "tab" }],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([9]));
            matches.push(match.name);

            match = state.process(Buffer.from([9]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-i><Tab>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [{ key: "ctrl", input: "i" }, { key: "tab" }],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([9]));
            matches.push(match.name);

            match = state.process(Buffer.from([9]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-m><C-m>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [
                    { key: "ctrl", input: "m" },
                    { key: "ctrl", input: "m" },
                ],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([13]));
            matches.push(match.name);

            match = state.process(Buffer.from([13]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<CR><CR>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [{ key: "return" }, { key: "return" }],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([13]));
            matches.push(match.name);

            match = state.process(Buffer.from([13]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<CR><C-m>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [{ key: "return" }, { key: "ctrl", input: "m" }],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([13]));
            matches.push(match.name);

            match = state.process(Buffer.from([13]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-' '><C-' '>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [
                    { key: "ctrl", input: " " },
                    { key: "ctrl", input: " " },
                ],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([0]));
            matches.push(match.name);

            match = state.process(Buffer.from([0]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-2><C-2>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [
                    { key: "ctrl", input: " " },
                    { key: "ctrl", input: " " },
                ],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([0]));
            matches.push(match.name);

            match = state.process(Buffer.from([0]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<C-2><C-' '>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [
                    { key: "ctrl", input: "2" },
                    { key: "ctrl", input: " " },
                ],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([0]));
            matches.push(match.name);

            match = state.process(Buffer.from([0]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, "foo"]);
        });
        test("<Esc><Esc><Esc>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [{ key: "esc" }, { key: "esc" }, { key: "esc" }],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([27]));
            matches.push(match.name);

            match = state.process(Buffer.from([27]));
            matches.push(match.name);

            match = state.process(Buffer.from([27]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<C-3><C-3><C-3>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [
                    { key: "ctrl", input: "3" },
                    { key: "ctrl", input: "3" },
                    { key: "ctrl", input: "3" },
                ],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([27]));
            matches.push(match.name);

            match = state.process(Buffer.from([27]));
            matches.push(match.name);

            match = state.process(Buffer.from([27]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<C-[><C-[><C-[>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [
                    { key: "ctrl", input: "[" },
                    { key: "ctrl", input: "[" },
                    { key: "ctrl", input: "[" },
                ],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([27]));
            matches.push(match.name);

            match = state.process(Buffer.from([27]));
            matches.push(match.name);

            match = state.process(Buffer.from([27]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
        test("<Esc><C-3><C-[>", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [
                    { key: "esc" },
                    { key: "ctrl", input: "3" },
                    { key: "ctrl", input: "[" },
                ],
            });

            const matches = [] as (string | undefined)[];

            let match = state.process(Buffer.from([27]));
            matches.push(match.name);

            match = state.process(Buffer.from([27]));
            matches.push(match.name);

            match = state.process(Buffer.from([27]));
            matches.push(match.name);

            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
    });
});

describe.skip("KeyMapState with legacy encodings", () => {
    describe("Invalid CSI sequences do not corrupt state", () => {
        test("Mouse input CSI", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: [{ input: "abc" }],
            });

            const matches = [] as (string | undefined)[];

            let match: ReturnType<typeof state.process>;
            for (let i = 97; i < 100; ++i) {
                state.process(Buffer.from("\x1b[<35;1;1M")); // mouse escape code
                match = state.process(Buffer.from([i]));
                matches.push(match.name);
            }
            expect(matches).toEqual([undefined, undefined, "foo"]);
        });
    });

    test("Modifier only keys do not corrupt state (kitty shift only)", () => {
        const state = new KeyMapState();
        state.addAction({
            name: "foo",
            keymap: [{ input: "abc" }],
        });

        const matches = [] as (string | undefined)[];

        let match: ReturnType<typeof state.process>;
        for (let i = 97; i < 100; ++i) {
            state.process(Buffer.from("\x1b[57441u")); // shift only
            match = state.process(Buffer.from([i]));
            matches.push(match.name);
        }
        expect(matches).toEqual([undefined, undefined, "foo"]);
    });
});

describe("KeyMapState with kitty buffers", () => {
    test("double tab /w previous ambiguous keys", () => {
        const inputState = new InputState();
        // Send ambiguous keycodes for Tab, Ctrl + i
        inputState.process(Buffer.from([9]), new ActionStore());
        inputState.process(Buffer.from([9]), new ActionStore());

        const store = new ActionStore({
            actions: [
                { name: "TAB", keymap: [{ key: "tab" }, { key: "tab" }] },
            ],
        });

        // Send kitty CSI sequences for Tab (we already sent 2 unhandled for
        // keycode 9, so should match after just 1 kitty Tab)
        const match = inputState.process(Buffer.from("\x1b[9u"), store);
        expect(match.name).toBe("TAB");
    });

    // prettier-ignore
    test("long sequence", () => {
        const state = new KeyMapState();

        state.addAction({
            keymap: [
                { key: ["super", "ctrl"], input: "Aa" },
                { key: "alt", input: "ccc" },
            ],
            name: "foobar",
        });

        state.process(Buffer.from(`\x1b[97;${encodeMods(["super", "ctrl", "shift"])}u`));
        state.process(Buffer.from(`\x1b[97;${encodeMods(["super", "ctrl"])}u`));
        state.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`));
        state.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`));
        const match = state.process(Buffer.from(`\x1b[99;${encodeMods(["alt"])}u`));

        expect(match.name).toBe("foobar");
    });
});

describe("KeyMapState supports various ways of setting KeyMaps", () => {
    describe("KeyMapBuilder", () => {
        test("key.input('a')", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: key.input("a"),
            });

            const match = state.process(Buffer.from([97]));
            expect(match.name).toBe("foo");
        });

        test("key.ctrl.input('aaa')", () => {
            const state = new KeyMapState();
            state.addAction({
                name: "foo",
                keymap: key.ctrl.input("aaa"),
            });

            let match = state.process(Buffer.from([1]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([1]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([1]));
            expect(match.name).toBe("foo");
        });
    });

    describe("string notation", () => {
        test("<C-a>", () => {
            const state = new KeyMapState();
            state.addAction({ name: "foo", keymap: "<C-a>" });
            const match = state.process(Buffer.from([1]));
            expect(match.name).toBe("foo");
        });

        test("aaa", () => {
            const state = new KeyMapState();
            state.addAction({ name: "foo", keymap: "aaa" });

            let match = state.process(Buffer.from([97]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([97]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([97]));
            expect(match.name).toBe("foo");
        });
    });
});

describe("KeyMapState with with leader", () => {
    describe("set leader in ctor", () => {
        test("KeyMap (length 1 keymap { input: 'a' })", () => {
            const state = new KeyMapState({ leader: { input: "a" } });
            state.addAction({
                name: "foo",
                keymap: {
                    leader: true,
                    input: "b",
                },
            });

            let match = state.process(Buffer.from([97]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([98]));
            expect(match.name).toBe("foo");
        });

        test("KeyMap[] (length >1 [{ input: 'a' }, { input: 'b' }]", () => {
            const state = new KeyMapState({
                leader: [{ input: "a" }, { input: "b" }],
            });

            state.addAction({
                name: "foo",
                keymap: {
                    leader: true,
                    input: "c",
                },
            });

            let match = state.process(Buffer.from([97]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([98]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([99]));
            expect(match.name).toBe("foo");
        });

        test("string KeyMap ('a'))", () => {
            const state = new KeyMapState({
                leader: "a",
            });

            state.addAction({
                name: "foo",
                keymap: {
                    leader: true,
                    input: "b",
                },
            });

            let match = state.process(Buffer.from([97]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([98]));
            expect(match.name).toBe("foo");
        });

        test("string KeyMap[] ('ab')", () => {
            const state = new KeyMapState({
                leader: "ab",
            });

            state.addAction({
                name: "foo",
                keymap: {
                    leader: true,
                    input: "c",
                },
            });

            let match = state.process(Buffer.from([97]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([98]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([99]));
            expect(match.name).toBe("foo");
        });

        test("KeyMapBuilder (key.input('ab')", () => {
            const state = new KeyMapState({ leader: key.input("ab") });

            state.addAction({
                name: "foo",
                keymap: {
                    leader: true,
                    input: "c",
                },
            });

            let match = state.process(Buffer.from([97]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([98]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([99]));
            expect(match.name).toBe("foo");
        });

        test("KeyMapBuilder (key.ctrl.input('a')", () => {
            const state = new KeyMapState({ leader: key.ctrl.input("a") });

            state.addAction({
                name: "foo",
                keymap: {
                    leader: true,
                    input: "b",
                },
            });

            let match = state.process(Buffer.from([1]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([98]));
            expect(match.name).toBe("foo");
        });
    });

    describe("Use leader in keymap", () => {
        test("KeyMapBuilder", () => {
            const state = new KeyMapState({ leader: key.ctrl.input("a") });
            state.addAction({ name: "foo", keymap: key.leader.input("b") });

            let match = state.process(Buffer.from([1]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([98]));
            expect(match.name).toBe("foo");
        });

        test("string leader", () => {
            const state = new KeyMapState({ leader: key.ctrl.input("a") });
            state.addAction({ name: "foo", keymap: "<leader>b" });

            let match = state.process(Buffer.from([1]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from([98]));
            expect(match.name).toBe("foo");
        });

        test("keymap using leader with sequence length after leader > 1", () => {
            const state = new KeyMapState({ leader: key.ctrl.input("a") });
            state.addAction({ name: "foo", keymap: "<leader>foo" });
            let match = state.process(Buffer.from([1]));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from("f"));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from("o"));
            expect(match.name).toBe(undefined);
            match = state.process(Buffer.from("o"));
            expect(match.name).toBe("foo");
        });
    });

    test("leader can have a sequence length >1", () => {
        const state = new KeyMapState({
            leader: key.ctrl.input("abc").ctrl.input("def"),
        });
        state.addAction({ name: "foo", keymap: key.leader.input("g") });
        let match = state.process(Buffer.from([1]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([1]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([2]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([3]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([4]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([5]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([6]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([103]));
        expect(match.name).toBe("foo");
    });

    test("leader can be used twice in a keymap", () => {
        const state = new KeyMapState({
            leader: key.ctrl.input("a").ctrl.input("a"),
        });
        state.addAction({ name: "foo", keymap: key.leader.input("b") });
        let match = state.process(Buffer.from([1]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([1]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([98]));
        expect(match.name).toBe("foo");
    });

    test("KeyMap can use leader and the value of leader together", () => {
        const state = new KeyMapState({
            leader: key.ctrl.input("a"),
        });
        state.addAction({ name: "foo", keymap: key.leader.ctrl.input("a") });
        let match = state.process(Buffer.from([1]));
        expect(match.name).toBe(undefined);
        match = state.process(Buffer.from([1]));
        expect(match.name).toBe("foo");
    });
});

describe("Invalid keymaps do not match", () => {
    test("keymap uses leader, but no leader is set", () => {
        const state = new KeyMapState();
        state.addAction({ name: "foo", keymap: key.leader.input("a") });
        const match = state.process(Buffer.from([97]));
        expect(match.name).toBe(undefined);
    });

    test("KeyMap with modifiers only", () => {
        const state = new KeyMapState();
        state.addAction({ name: "foo", keymap: { key: ["ctrl"] } });
        const kittyCtrlOnly = "\x1b[57442;5u";
        const match = state.process(Buffer.from(kittyCtrlOnly));
        expect(match.name).toBe(undefined);
    });

    test("Empty keymap: {}", () => {
        const state = new KeyMapState();
        state.addAction({ name: "foo", keymap: {} });
        const match = state.process(Buffer.from([]));
        expect(match.name).toBe(undefined);
    });

    test("Empty keymap: []", () => {
        const state = new KeyMapState();
        state.addAction({ name: "foo", keymap: [] });
        const match = state.process(Buffer.from([]));
        expect(match.name).toBe(undefined);
    });
});
