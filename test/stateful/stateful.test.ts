import { describe, expect, test } from "vitest";
import { InputTree } from "../../src/stateful/InputTree.js";
import { createKeymap } from "../../src/stateful/createKeymap.js";

describe("stateful", () => {
    const ip = new InputTree(50);

    const getKeymaps = () => [
        createKeymap({
            keymap: [{ key: "tab" }, { key: "tab" }],
            name: "TAB_TEST",
        }),
    ];

    describe("Legacy ambiguous", () => {
        test("double tab", () => {
            const keymaps = getKeymaps();
            ip.process(Buffer.from([9]), keymaps);
            const match = ip.process(Buffer.from([9]), keymaps);
            expect(match.name).toBe("TAB_TEST");
        });

        test("tab concat ctrl + i", () => {
            /**
             * This is impossible to match because InputTree creates compatible
             * paths based on the ambiguity of the buffer it receives.  For example,
             * because keycode 9 is ambiguous with Tab and Ctrl + i, the tree will
             * split at the leaf nodes and create two separate paths (if they don't
             * already exist) where keycode 9 means only one of the possiblities.
             * Therefore, Ctrl + i cannot exist on the same path as Tab.
             *
             * NOTE: The path only splits when an ambiguous **buffer** is
             * processed.  Kitty sends unambiguous buffers, so the Kitty protocol
             * allows for Ctrl + i and Tab to be on the same path.
             */
            const keymaps = [
                createKeymap({
                    name: "IMPOSSIBLE",
                    keymap: [{ key: "tab" }, { key: "ctrl", input: "i" }],
                }),
            ];

            ip.process(Buffer.from([9]), keymaps);
            const match = ip.process(Buffer.from([9]), keymaps);

            expect(match.name).toBe(undefined);
        });
    });

    describe("Kitty", () => {
        test.todo("double tab /wo clear", () => {
            const keymaps = getKeymaps();
            ip.process(Buffer.from("\x1b[9u"), keymaps);
            const match = ip.process(Buffer.from("\x1b[9u"), keymaps);
            expect(match.name).toBe("TAB_TEST");
        });

        test("double tab w/ clear before", () => {
            ip.clear();
            const keymaps = getKeymaps();
            ip.process(Buffer.from("\x1b[9u"), keymaps);
            const match = ip.process(Buffer.from("\x1b[9u"), keymaps);
            expect(match.name).toBe("TAB_TEST");
        });
    });
});
