import { describe, test, expect } from "vitest";
import { KeyMap } from "../../src/stateful/match.js";
import { tokenizeString } from "../../src/tokenizeString.js";

describe("tokenizeString", () => {
    test.each<[string, KeyMap[]]>([
        // ["<>", []],
        ["foobar", [{ input: "foobar" }]],
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
        ["<BS>", [{ key: "backspace" }]],
        ["<CR>", [{ key: "return" }]],
    ])("%s", (str, keymap) => {
        const result = tokenizeString(str);
        expect(result).toEqual(keymap);
    });
});

describe("tokenizeString invalid sequences", () => {
    test.each<[string, string]>([
        ["<foobar-C-d>foobar<tab><f1>", "input before modifier"],
    ])("%s - %s", (str) => {
        const result = tokenizeString(str);
        expect(result).toEqual(undefined);
    });
});
