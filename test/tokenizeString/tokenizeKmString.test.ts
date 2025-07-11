import { describe, test, expect } from "vitest";
import { KeyMap } from "../../src/stateful/match.js";
import { tokenizeKmString } from "../../src/tokenize_string/tokenizeKmString.js";

describe("tokenizeKmString", () => {
    test.each<[string, KeyMap[]]>([
        // ["<>", []],
        ["foobar", [{ input: "foobar" }]],
        ["<C-x>", [{ key: ["ctrl"], input: "x" }]],

        // a.toUpperCase matches ModMap, so this is an edge case
        ["<C-a>", [{ key: ["ctrl"], input: "a" }]],
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

describe("tokenizeKmString invalid sequences", () => {
    test.each<[string, string]>([
        ["<foobar-C-d>foobar<tab><f1>", "input before modifier"],
    ])("%s - %s", (str) => {
        const result = tokenizeKmString(str);
        expect(result).toEqual(undefined);
    });
});

describe.todo("tokenizeKmString edge cases", () => {
    test("Modifier + lowercase modifier in mod seq", () => {
        const result = tokenizeKmString("<a-a>");
        expect(result).toEqual([{ key: ["alt"], input: "a" }]);
    });

    test("Empty str", () => {
        const result = tokenizeKmString("");
        expect(result).toEqual([]);
    });

    test("Empty key seq", () => {
        const result = tokenizeKmString("<>");
        expect(result).toEqual([{ input: "<>" }]);
    });

    test("Multiple nested empty key sequences", () => {
        const result = tokenizeKmString("<<<>>>");
        expect(result).toEqual([{ input: "<<<>>>" }]);
    });

    test("Unterminated key seq", () => {
        const result = tokenizeKmString("<C-A-foo");
        expect(result).toEqual([{ input: "<C-A-foo" }]);
    });

    test("- in mod seq not used an delim", () => {
        const result = tokenizeKmString("<C-->");
        expect(result).toEqual([{ key: ["ctrl"], input: "-" }]);
    });

    test("favors final brackets in mod seq", () => {
        // interprets as
        // '<C-foo' + <CR>
        // NOT
        // Ctrl + 'foo<CR'
        const result = tokenizeKmString("<C-foo<CR>");
        expect(result).toEqual([{ input: "<C-foo" }, { key: ["return"] }]);
    });

    test("brackets within brackets", () => {
        const result = tokenizeKmString("<C-foo<CR>>");
        expect(result).toEqual([
            { input: "<C-foo" },
            { key: ["return"] },
            { input: ">" },
        ]);
    });

    test("brackets within brackets 2 levels deep", () => {
        const result = tokenizeKmString("<CR<CR<CR>>>");
        expect(result).toEqual([
            { input: "<CR<CR" },
            { key: ["return"] },
            { input: ">>" },
        ]);
    });
});
