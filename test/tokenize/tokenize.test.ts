import { describe, test, expect } from "vitest";
import { tokenize } from "../../src/tokenize/tokenize.js";
import type { KeyMap } from "../../src/types.js";

describe("tokenizeKmString", () => {
    describe("Groupings", () => {
        test("Mod + non-ambiguous char", () => {
            const result = tokenize("<C-f>");
            expect(result).toEqual([{ key: ["ctrl"], input: "f" }]);
        });

        test("Mod + char that could be interpreted as a Mod", () => {
            const result = tokenize("<C-a>");
            expect(result).toEqual([{ key: ["ctrl"], input: "a" }]);
        });

        test("Mod + multiple chars", () => {
            const result = tokenize("<C-foobar>");
            expect(result).toEqual([{ key: ["ctrl"], input: "foobar" }]);
        });

        test("Duplicate mod downgrades rest of string to input priority", () => {
            const result = tokenize("<C-A-C>");
            expect(result).toEqual([{ key: ["ctrl", "alt"], input: "C" }]);
        });

        test("Once Input Phase is reached, '-' chars are not skipped", () => {
            const result = tokenize("<C-A-C-foo>");
            expect(result).toEqual([{ key: ["ctrl", "alt"], input: "C-foo" }]);
        });

        test("Keys only", () => {
            const result = tokenize("<f1><f2><f3>");
            expect(result).toEqual([
                { key: ["f1"] },
                { key: ["f2"] },
                { key: ["f3"] },
            ]);
        });

        test("Abbreviated versions of keys CR, BS, DEL", () => {
            const result = tokenize("<CR><BS><DEL>");
            expect(result).toEqual([
                { key: ["return"] },
                { key: ["backspace"] },
                { key: ["delete"] },
            ]);
        });

        test("Capitalization does not matter for keys", () => {
            const result = tokenize("<INSERT><bs>");
            expect(result).toEqual([
                { key: ["insert"] },
                { key: ["backspace"] },
            ]);
        });

        test("Capitalization does not matter for modifiers", () => {
            const result = tokenize("<c-A-d-foo>");
            expect(result).toEqual([
                { key: ["ctrl", "alt", "super"], input: "foo" },
            ]);
        });

        test("Possible modifier at the end of a grouping is interpreted as string literal", () => {
            const result = tokenize("<C-A-D>");
            expect(result).toEqual([{ key: ["ctrl", "alt"], input: "D" }]);
        });

        test("Grouping with only a single modifier interpreted as string literal", () => {
            const result = tokenize("<C>");
            expect(result).toEqual([{ input: "<C>" }]);
        });

        test("Empty grouping interpreted as string literal", () => {
            const result = tokenize("<>");
            expect(result).toEqual([{ input: "<>" }]);
        });

        test("grouping with only -", () => {
            const result = tokenize("<->");
            expect(result).toEqual([{ input: "<->" }]);
        });

        test("Multiple nested empty grouping", () => {
            const result = tokenize("<<<>>>");
            expect(result).toEqual([{ input: "<<<>>>" }]);
        });

        test("Grouping w/o Keys or Mods interpreted as string literal", () => {
            const result = tokenize("<foobar>");
            expect(result).toEqual([{ input: "<foobar>" }]);
        });

        test("Unterminated grouping interpreted as string literal", () => {
            const result = tokenize("<C-foo");
            expect(result).toEqual([{ input: "<C-foo" }]);
        });

        test("Grouping with only a single Key is valid", () => {
            const result = tokenize("<tab>");
            expect(result).toEqual([{ key: ["tab"] }]);
        });

        test("Input before Modifier breaks down to string literal", () => {
            const result = tokenize("<foo-C>");
            expect(result).toEqual([{ input: "<foo-C>" }]);
        });

        test("Interprets in correct phase for each group member (Mods->Keys->Input)", () => {
            const result = tokenize("<C-foo<CR>");
            expect(result).toEqual([{ key: ["ctrl"], input: "foo<CR" }]);
        });

        // Can also interpret this as Key before Modifier breaks down to string literal
        // (The term will not send data for a non-modifier + some other keypress)
        // TODO: The reason the tokenizer allows for Key + Modifier w/ or w/o input is
        // is because I think there are some rare edge cases where the term allows this, even
        // though in most cases those combinations will not be sent
        test("Keys cannot be combined with input", () => {
            const result = tokenize("<delete-C>");
            expect(result).toEqual([{ input: "<delete-C>" }]);
        });

        // NOTE: The term would not send this as a possibility, but the tokenizer
        // should allow it for simplicity
        test("Grouping with multiple Keys are valid", () => {
            const result = tokenize("<tab-insert-delete>");
            expect(result).toEqual([{ key: ["tab", "insert", "delete"] }]);
        });

        test("Groupings can be combined with surrounding input", () => {
            const result = tokenize("foo<CR>bar");
            expect(result).toEqual([
                { input: "foo" },
                { key: ["return"] },
                { input: "bar" },
            ]);
        });

        test("Groupings can handle oddly placed '-' chars", () => {
            const result = tokenize("<C-->");
            expect(result).toEqual([{ key: ["ctrl"], input: "-" }]);
        });

        test("More oddly placed hyphens", () => {
            const result = tokenize("<C-A---foo-bar>");
            expect(result).toEqual([
                { key: ["ctrl", "alt"], input: "--foo-bar" },
            ]);
        });

        test("Groupings can handle opening tags", () => {
            const result = tokenize("<C-<>");
            expect(result).toEqual([{ key: ["ctrl"], input: "<" }]);
        });

        test("Closing tags however, always close grouping", () => {
            const result = tokenize("<C-foo>>");
            expect(result).toEqual([
                { key: ["ctrl"], input: "foo" },
                { input: ">" },
            ]);
        });

        test("Opening tag after hyphen separator", () => {
            const result = tokenize("<C-<foo>");
            expect(result).toEqual([{ key: ["ctrl"], input: "<foo" }]);
        });

        test("Multiple opening tags after hyphen separator", () => {
            const result = tokenize("<C-<foo-<foo>");
            expect(result).toEqual([{ key: ["ctrl"], input: "<foo-<foo" }]);
        });

        test("Handles odd characters", () => {
            const result = tokenize("<C-<foo<-!@#$%^&*()_+>");
            expect(result).toEqual([
                { key: ["ctrl"], input: "<foo<-!@#$%^&*()_+" },
            ]);
        });

        test("Groups within groups are ignored due to first closing tag always closing group", () => {
            const result = tokenize("<C-foo<CR>>");
            expect(result).toEqual([
                { key: ["ctrl"], input: "foo<CR" },
                { input: ">" },
            ]);
        });

        test("Nested groups ignored - 2 levels deep", () => {
            const result = tokenize("<CR<CR<CR>>>");
            expect(result).toEqual([
                { input: "<CR<CR" },
                { key: ["return"] },
                { input: ">>" },
            ]);
        });
    });

    describe("Sequences containing isolated input and more complexity", () => {
        test("Empty string", () => {
            const result = tokenize("");
            expect(result).toEqual([]);
        });

        test.each<[string, KeyMap[]]>([
            ["foobar", [{ input: "foobar" }]],
            [
                "<C-x>foobar",
                [{ key: ["ctrl"], input: "x" }, { input: "foobar" }],
            ],
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
                "<C-f><tab><f1>foo<tab><tab>",
                [
                    { key: ["ctrl"], input: "f" },
                    { key: ["tab"] },
                    { key: ["f1"] },
                    { input: "foo" },
                    { key: ["tab"] },
                    { key: ["tab"] },
                ],
            ],
            ["<C-F1>", [{ key: ["ctrl", "f1"] }]],
        ])("%s", (str, keymap) => {
            const result = tokenize(str);
            expect(result).toEqual(keymap);
        });
    });
});
