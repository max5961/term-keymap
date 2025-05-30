import { describe, test, expect } from "vitest";
import { checkParse } from "./helpers/helpers";

test("checkParse works", () => {
    expect(checkParse("a", { input: "a" })).toBe(true);
    expect(checkParse([97], { input: "a" })).toBe(true);
    expect(checkParse("a", { input: "b" })).toBe(false);
    expect(checkParse([97], { input: "b" })).toBe(false);
    expect(checkParse("a", { input: "a", key: "ctrl" })).toBe(false);
    expect(checkParse([97], { input: "a", key: "ctrl" })).toBe(false);
});

describe("legacy buffers", () => {
    test("lowercase alphabet", () => {
        expect(checkParse([97], { input: "a" })).toBe(true);
        expect(checkParse([98], { input: "b" })).toBe(true);
        expect(checkParse([99], { input: "c" })).toBe(true);
        expect(checkParse([100], { input: "d" })).toBe(true);
        expect(checkParse([101], { input: "e" })).toBe(true);
        expect(checkParse([102], { input: "f" })).toBe(true);
        expect(checkParse([103], { input: "g" })).toBe(true);
        expect(checkParse([104], { input: "h" })).toBe(true);
        expect(checkParse([105], { input: "i" })).toBe(true);
        expect(checkParse([106], { input: "j" })).toBe(true);
        expect(checkParse([107], { input: "k" })).toBe(true);
        expect(checkParse([108], { input: "l" })).toBe(true);
        expect(checkParse([109], { input: "m" })).toBe(true);
        expect(checkParse([110], { input: "n" })).toBe(true);
        expect(checkParse([111], { input: "o" })).toBe(true);
        expect(checkParse([112], { input: "p" })).toBe(true);
        expect(checkParse([113], { input: "q" })).toBe(true);
        expect(checkParse([114], { input: "r" })).toBe(true);
        expect(checkParse([115], { input: "s" })).toBe(true);
        expect(checkParse([116], { input: "t" })).toBe(true);
        expect(checkParse([117], { input: "u" })).toBe(true);
        expect(checkParse([118], { input: "v" })).toBe(true);
        expect(checkParse([119], { input: "w" })).toBe(true);
        expect(checkParse([120], { input: "x" })).toBe(true);
        expect(checkParse([121], { input: "y" })).toBe(true);
        expect(checkParse([122], { input: "z" })).toBe(true);
    });

    test("uppercase alphabet", () => {
        expect(checkParse([65], { input: "A" })).toBe(true);
        expect(checkParse([66], { input: "B" })).toBe(true);
        expect(checkParse([67], { input: "C" })).toBe(true);
        expect(checkParse([68], { input: "D" })).toBe(true);
        expect(checkParse([69], { input: "E" })).toBe(true);
        expect(checkParse([70], { input: "F" })).toBe(true);
        expect(checkParse([71], { input: "G" })).toBe(true);
        expect(checkParse([72], { input: "H" })).toBe(true);
        expect(checkParse([73], { input: "I" })).toBe(true);
        expect(checkParse([74], { input: "J" })).toBe(true);
        expect(checkParse([75], { input: "K" })).toBe(true);
        expect(checkParse([76], { input: "L" })).toBe(true);
        expect(checkParse([77], { input: "M" })).toBe(true);
        expect(checkParse([78], { input: "N" })).toBe(true);
        expect(checkParse([79], { input: "O" })).toBe(true);
        expect(checkParse([80], { input: "P" })).toBe(true);
        expect(checkParse([81], { input: "Q" })).toBe(true);
        expect(checkParse([82], { input: "R" })).toBe(true);
        expect(checkParse([83], { input: "S" })).toBe(true);
        expect(checkParse([84], { input: "T" })).toBe(true);
        expect(checkParse([85], { input: "U" })).toBe(true);
        expect(checkParse([86], { input: "V" })).toBe(true);
        expect(checkParse([87], { input: "W" })).toBe(true);
        expect(checkParse([88], { input: "X" })).toBe(true);
        expect(checkParse([89], { input: "Y" })).toBe(true);
        expect(checkParse([90], { input: "Z" })).toBe(true);
    });

    test("ascii encodings 0-128", () => {
        // need to expend KeyMap for this specific use case because of ambiguous buffers
        // expect(checkParse([0], {input: }))
    });
});
