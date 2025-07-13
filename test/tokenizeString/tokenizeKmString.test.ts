import { describe, test, expect } from "vitest";
import { KeyMap } from "../../src/stateful/match.js";
import { tokenizeKmString } from "../../src/tokenize_string/tokenizeKmString.js";

describe("tokenizeKmString", () => {
    test.each<[string, KeyMap[]]>([
        ["foobar", [{ input: "foobar" }]],
        ["<C-x>", [{ key: ["ctrl"], input: "x" }]],
        ["<f1>", [{ key: ["f1"] }]],
        ["<F1>", [{ key: ["f1"] }]],

        [
            "<C-A-D-M-foo>",
            [{ key: ["ctrl", "alt", "super", "meta"], input: "foo" }],
        ],
        [
            "<C-f><C-o><C-o>",
            [
                { key: ["ctrl"], input: "f" },
                { key: ["ctrl"], input: "o" },
                { key: ["ctrl"], input: "o" },
            ],
        ],
        [
            "<C-f><tab><f1>foo",
            [
                { key: ["ctrl"], input: "f" },
                { key: ["tab"] },
                { key: ["f1"] },
                { input: "foo" },
            ],
        ],
        ["<C-F1>", [{ key: ["ctrl", "f1"] }]],
        ["<BS>", [{ key: ["backspace"] }]],
        ["<CR>", [{ key: ["return"] }]],
    ])("%s", (str, keymap) => {
        const result = tokenizeKmString(str);
        expect(result).toEqual(keymap);
    });
});

describe("tokenizeKmString edge cases", () => {
    test("Modifier + lowercase modifier in grouping", () => {
        const result = tokenizeKmString("<a-a>");
        expect(result).toEqual([{ key: ["alt"], input: "a" }]);
    });

    test("Modifier + different modifier in grouping", () => {
        const result = tokenizeKmString("<a-c>");
        expect(result).toEqual([{ key: ["alt"], input: "c" }]);
    });

    test("Modifier + non modifier in grouping", () => {
        const result = tokenizeKmString("<c-f>");
        expect(result).toEqual([{ key: ["ctrl"], input: "f" }]);
    });

    test("Empty str", () => {
        const result = tokenizeKmString("");
        expect(result).toEqual([]);
    });

    test("Empty grouping", () => {
        const result = tokenizeKmString("<>");
        expect(result).toEqual([{ input: "<>" }]);
    });

    test("grouping with only -", () => {
        const result = tokenizeKmString("<->");
        expect(result).toEqual([{ input: "<->" }]);
    });

    test("Multiple nested empty grouping", () => {
        const result = tokenizeKmString("<<<>>>");
        expect(result).toEqual([{ input: "<<<>>>" }]);
    });

    test("Unterminated grouping", () => {
        const result = tokenizeKmString("<C-A-foo");
        expect(result).toEqual([{ input: "<C-A-foo" }]);
    });

    test("- in mod seq not used an delim", () => {
        const result = tokenizeKmString("<C-->");
        expect(result).toEqual([{ key: ["ctrl"], input: "-" }]);
    });

    test("Respects priority of types in the group (Mods -> Keys -> chars)", () => {
        const result = tokenizeKmString("<C-foo<CR>");
        expect(result).toEqual([{ key: ["ctrl"], input: "foo<CR" }]);
    });

    test("brackets within brackets", () => {
        const result = tokenizeKmString("<C-foo<CR>>");
        expect(result).toEqual([
            { key: ["ctrl"], input: "foo<CR" },
            { input: ">" },
        ]);
    });

    test("groupings within groupings 2 levels deep", () => {
        const result = tokenizeKmString("<CR<CR<CR>>>");
        expect(result).toEqual([
            { input: "<CR<CR" },
            { key: ["return"] },
            { input: ">>" },
        ]);
    });
});
