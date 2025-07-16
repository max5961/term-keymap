import { describe, test, expect } from "vitest";
import { checkParse } from "../helpers/checkParse.js";
import { parseBuffer } from "../../src/parsers/parseBuffer.js";
import type { KeyMap } from "../../src/types.js";

describe("single bytes - ascii 0-127", () => {
    describe("lowercase alphabet", () => {
        test.each([
            [[97], { input: "a" }],
            [[98], { input: "b" }],
            [[99], { input: "c" }],
            [[100], { input: "d" }],
            [[101], { input: "e" }],
            [[102], { input: "f" }],
            [[103], { input: "g" }],
            [[104], { input: "h" }],
            [[105], { input: "i" }],
            [[106], { input: "j" }],
            [[107], { input: "k" }],
            [[108], { input: "l" }],
            [[109], { input: "m" }],
            [[110], { input: "n" }],
            [[111], { input: "o" }],
            [[112], { input: "p" }],
            [[113], { input: "q" }],
            [[114], { input: "r" }],
            [[115], { input: "s" }],
            [[116], { input: "t" }],
            [[117], { input: "u" }],
            [[118], { input: "v" }],
            [[119], { input: "w" }],
            [[120], { input: "x" }],
            [[121], { input: "y" }],
            [[122], { input: "z" }],
        ])("buffer %o => %o", (buf, keymap) => {
            expect(checkParse(buf, keymap)).toBe(true);
        });
    });

    describe("uppercase alphabet", () => {
        test.each([
            [[65], { input: "A" }],
            [[66], { input: "B" }],
            [[67], { input: "C" }],
            [[68], { input: "D" }],
            [[69], { input: "E" }],
            [[70], { input: "F" }],
            [[71], { input: "G" }],
            [[72], { input: "H" }],
            [[73], { input: "I" }],
            [[74], { input: "J" }],
            [[75], { input: "K" }],
            [[76], { input: "L" }],
            [[77], { input: "M" }],
            [[78], { input: "N" }],
            [[79], { input: "O" }],
            [[80], { input: "P" }],
            [[81], { input: "Q" }],
            [[82], { input: "R" }],
            [[83], { input: "S" }],
            [[84], { input: "T" }],
            [[85], { input: "U" }],
            [[86], { input: "V" }],
            [[87], { input: "W" }],
            [[88], { input: "X" }],
            [[89], { input: "Y" }],
            [[90], { input: "Z" }],
        ])("buffer %o => %o", (buf, keymap) => {
            expect(checkParse(buf, keymap)).toBe(true);
        });
    });

    describe("non ambiguous ascii keycodes (!letter)", () => {
        test.each<[number[], KeyMap]>([
            [[1], { key: "ctrl", input: "a" }],
            [[2], { key: "ctrl", input: "b" }],
            [[3], { key: "ctrl", input: "c" }],
            [[4], { key: "ctrl", input: "d" }],
            [[5], { key: "ctrl", input: "e" }],
            [[6], { key: "ctrl", input: "f" }],
            [[7], { key: "ctrl", input: "g" }],
            // 8
            // 9
            [[10], { key: "ctrl", input: "j" }],
            [[11], { key: "ctrl", input: "k" }],
            [[12], { key: "ctrl", input: "l" }],
            // 13
            [[14], { key: "ctrl", input: "n" }],
            [[15], { key: "ctrl", input: "o" }],
            [[16], { key: "ctrl", input: "p" }],
            [[17], { key: "ctrl", input: "q" }],
            [[18], { key: "ctrl", input: "r" }],
            [[19], { key: "ctrl", input: "s" }],
            [[20], { key: "ctrl", input: "t" }],
            [[21], { key: "ctrl", input: "u" }],
            [[22], { key: "ctrl", input: "v" }],
            [[23], { key: "ctrl", input: "w" }],
            [[24], { key: "ctrl", input: "x" }],
            [[25], { key: "ctrl", input: "y" }],
            [[26], { key: "ctrl", input: "z" }],
            // 27
            // 28
            // 29
            // 30
            // 31
            [[32], { input: " " }],
            [[33], { input: "!" }],
            [[34], { input: '"' }],
            [[35], { input: "#" }],
            [[36], { input: "$" }],
            [[37], { input: "%" }],
            [[38], { input: "&" }],
            [[39], { input: "'" }],
            [[40], { input: "(" }],
            [[41], { input: ")" }],
            [[42], { input: "*" }],
            [[43], { input: "+" }],
            [[44], { input: "," }],
            [[45], { input: "-" }],
            [[46], { input: "." }],
            [[47], { input: "/" }],
            [[48], { input: "0" }],
            [[49], { input: "1" }],
            [[50], { input: "2" }],
            [[51], { input: "3" }],
            [[52], { input: "4" }],
            [[53], { input: "5" }],
            [[54], { input: "6" }],
            [[55], { input: "7" }],
            [[56], { input: "8" }],
            [[57], { input: "9" }],
            [[58], { input: ":" }],
            [[59], { input: ";" }],
            [[60], { input: "<" }],
            [[61], { input: "=" }],
            [[62], { input: ">" }],
            [[63], { input: "?" }],
            [[64], { input: "@" }],
            [[91], { input: "[" }],
            [[92], { input: "\\" }],
            [[93], { input: "]" }],
            [[94], { input: "^" }],
            [[95], { input: "_" }],
            [[96], { input: "`" }],
            [[123], { input: "{" }],
            [[124], { input: "|" }],
            [[125], { input: "}" }],
            [[126], { input: "~" }],
            // 127
        ])("buffer %o => %o", (buf, keymap) => {
            expect(checkParse(buf, keymap)).toBe(true);
        });
    });

    describe("ambiguous ctrl chars", () => {
        test("0", () => {
            const data = parseBuffer(Buffer.from([0]));
            expect(data.key.only("ctrl")).toBe(true);
            expect(data.input.only(" ", "2")).toBe(true);
        });

        test("8 (<C-h> | backspace)", () => {
            const data = parseBuffer(Buffer.from([8]));
            expect(data.key.only("ctrl", "backspace")).toBe(true);
            expect(data.input.only("h")).toBe(true);
        });

        test("9 (tab))", () => {
            const data = parseBuffer(Buffer.from([9]));
            expect(data.key.only("ctrl", "tab")).toBe(true);
            expect(data.input.only("i")).toBe(true);
        });

        test("13 (return)", () => {
            const data = parseBuffer(Buffer.from([13]));
            expect(data.key.only("ctrl", "return")).toBe(true);
            expect(data.input.only("m")).toBe(true);
        });

        test("27 (esc)", () => {
            const data = parseBuffer(Buffer.from([27]));
            expect(data.key.only("ctrl", "esc")).toBe(true);
            expect(data.input.only("3", "[")).toBe(true);
        });

        test("28", () => {
            const data = parseBuffer(Buffer.from([28]));
            expect(data.key.only("ctrl")).toBe(true);
            expect(data.input.only("4", "\\")).toBe(true);
        });

        test("29", () => {
            const data = parseBuffer(Buffer.from([29]));
            expect(data.key.only("ctrl")).toBe(true);
            expect(data.input.only("5", "]")).toBe(true);
        });

        test("30", () => {
            const data = parseBuffer(Buffer.from([30]));
            expect(data.key.only("ctrl")).toBe(true);
            expect(data.input.only("6", "^")).toBe(true);
        });

        test("31", () => {
            const data = parseBuffer(Buffer.from([31]));
            expect(data.key.only("ctrl")).toBe(true);
            expect(data.input.only("7", "/")).toBe(true);
        });

        test("127 (backspace)", () => {
            const data = parseBuffer(Buffer.from([127]));
            expect(data.key.only("ctrl", "backspace")).toBe(true);
            expect(data.input.only("8")).toBe(true);
        });
    });
});

describe("alt + keycode === [27, keycode]", () => {
    describe("Appends alt when esc + ctrl code", () => {
        test.each<[number[], KeyMap]>([
            [[27, 1], { key: ["alt", "ctrl"], input: "a" }],
            [[27, 2], { key: ["alt", "ctrl"], input: "b" }],
            [[27, 3], { key: ["alt", "ctrl"], input: "c" }],
        ])("%o => %o", (buf, keymap) => {
            expect(checkParse(buf, keymap)).toBe(true);
        });
    });

    describe("Appends alt to unshifted letters", () => {
        test.each<[number[], KeyMap]>([
            [[27, 97], { key: ["alt"], input: "a" }],
            [[27, 98], { key: ["alt"], input: "b" }],
            [[27, 99], { key: ["alt"], input: "c" }],
            [[27, 100], { key: ["alt"], input: "d" }],
            [[27, 101], { key: ["alt"], input: "e" }],
            [[27, 102], { key: ["alt"], input: "f" }],
            [[27, 103], { key: ["alt"], input: "g" }],
            [[27, 104], { key: ["alt"], input: "h" }],
            [[27, 105], { key: ["alt"], input: "i" }],
            [[27, 106], { key: ["alt"], input: "j" }],
            [[27, 107], { key: ["alt"], input: "k" }],
            [[27, 108], { key: ["alt"], input: "l" }],
            [[27, 109], { key: ["alt"], input: "m" }],
            [[27, 110], { key: ["alt"], input: "n" }],
            [[27, 111], { key: ["alt"], input: "o" }],
            [[27, 112], { key: ["alt"], input: "p" }],
            [[27, 113], { key: ["alt"], input: "q" }],
            [[27, 114], { key: ["alt"], input: "r" }],
            [[27, 115], { key: ["alt"], input: "s" }],
            [[27, 116], { key: ["alt"], input: "t" }],
            [[27, 117], { key: ["alt"], input: "u" }],
            [[27, 118], { key: ["alt"], input: "v" }],
            [[27, 119], { key: ["alt"], input: "w" }],
            [[27, 120], { key: ["alt"], input: "x" }],
            [[27, 121], { key: ["alt"], input: "y" }],
            [[27, 122], { key: ["alt"], input: "z" }],
        ])("%o => %o", (buf, keymap) => {
            expect(checkParse(buf, keymap)).toBe(true);
        });
    });

    describe("Appends alt to shifted letters", () => {
        test.each<[number[], KeyMap]>([
            [[27, 65], { key: ["alt"], input: "A" }],
            [[27, 66], { key: ["alt"], input: "B" }],
            [[27, 67], { key: ["alt"], input: "C" }],
            [[27, 68], { key: ["alt"], input: "D" }],
            [[27, 69], { key: ["alt"], input: "E" }],
            [[27, 70], { key: ["alt"], input: "F" }],
            [[27, 71], { key: ["alt"], input: "G" }],
            [[27, 72], { key: ["alt"], input: "H" }],
            [[27, 73], { key: ["alt"], input: "I" }],
            [[27, 74], { key: ["alt"], input: "J" }],
            [[27, 75], { key: ["alt"], input: "K" }],
            [[27, 76], { key: ["alt"], input: "L" }],
            [[27, 77], { key: ["alt"], input: "M" }],
            [[27, 78], { key: ["alt"], input: "N" }],
            [[27, 79], { key: ["alt"], input: "O" }],
            [[27, 80], { key: ["alt"], input: "P" }],
            [[27, 81], { key: ["alt"], input: "Q" }],
            [[27, 82], { key: ["alt"], input: "R" }],
            [[27, 83], { key: ["alt"], input: "S" }],
            [[27, 84], { key: ["alt"], input: "T" }],
            [[27, 85], { key: ["alt"], input: "U" }],
            [[27, 86], { key: ["alt"], input: "V" }],
            [[27, 87], { key: ["alt"], input: "W" }],
            [[27, 88], { key: ["alt"], input: "X" }],
            [[27, 89], { key: ["alt"], input: "Y" }],
            [[27, 90], { key: ["alt"], input: "Z" }],
        ])("%o => %o", (buf, keymap) => {
            expect(checkParse(buf, keymap)).toBe(true);
        });
    });

    describe("appends alt to non ambiguous ascii keycodes (!letter)", () => {
        test.each<[number[], KeyMap]>([
            [[27, 1], { key: ["ctrl", "alt"], input: "a" }],
            [[27, 2], { key: ["ctrl", "alt"], input: "b" }],
            [[27, 3], { key: ["ctrl", "alt"], input: "c" }],
            [[27, 4], { key: ["ctrl", "alt"], input: "d" }],
            [[27, 5], { key: ["ctrl", "alt"], input: "e" }],
            [[27, 6], { key: ["ctrl", "alt"], input: "f" }],
            [[27, 7], { key: ["ctrl", "alt"], input: "g" }],
            //27,  8
            //27,  9
            [[27, 10], { key: ["ctrl", "alt"], input: "j" }],
            [[27, 11], { key: ["ctrl", "alt"], input: "k" }],
            [[27, 12], { key: ["ctrl", "alt"], input: "l" }],
            //27,  13
            [[27, 14], { key: ["ctrl", "alt"], input: "n" }],
            [[27, 15], { key: ["ctrl", "alt"], input: "o" }],
            [[27, 16], { key: ["ctrl", "alt"], input: "p" }],
            [[27, 17], { key: ["ctrl", "alt"], input: "q" }],
            [[27, 18], { key: ["ctrl", "alt"], input: "r" }],
            [[27, 19], { key: ["ctrl", "alt"], input: "s" }],
            [[27, 20], { key: ["ctrl", "alt"], input: "t" }],
            [[27, 21], { key: ["ctrl", "alt"], input: "u" }],
            [[27, 22], { key: ["ctrl", "alt"], input: "v" }],
            [[27, 23], { key: ["ctrl", "alt"], input: "w" }],
            [[27, 24], { key: ["ctrl", "alt"], input: "x" }],
            [[27, 25], { key: ["ctrl", "alt"], input: "y" }],
            [[27, 26], { key: ["ctrl", "alt"], input: "z" }],
            // 27
            // 28
            // 29
            // 30
            // 31
            [[27, 32], { key: "alt", input: " " }],
            [[27, 33], { key: "alt", input: "!" }],
            [[27, 34], { key: "alt", input: '"' }],
            [[27, 35], { key: "alt", input: "#" }],
            [[27, 36], { key: "alt", input: "$" }],
            [[27, 37], { key: "alt", input: "%" }],
            [[27, 38], { key: "alt", input: "&" }],
            [[27, 39], { key: "alt", input: "'" }],
            [[27, 40], { key: "alt", input: "(" }],
            [[27, 41], { key: "alt", input: ")" }],
            [[27, 42], { key: "alt", input: "*" }],
            [[27, 43], { key: "alt", input: "+" }],
            [[27, 44], { key: "alt", input: "," }],
            [[27, 45], { key: "alt", input: "-" }],
            [[27, 46], { key: "alt", input: "." }],
            [[27, 47], { key: "alt", input: "/" }],
            [[27, 48], { key: "alt", input: "0" }],
            [[27, 49], { key: "alt", input: "1" }],
            [[27, 50], { key: "alt", input: "2" }],
            [[27, 51], { key: "alt", input: "3" }],
            [[27, 52], { key: "alt", input: "4" }],
            [[27, 53], { key: "alt", input: "5" }],
            [[27, 54], { key: "alt", input: "6" }],
            [[27, 55], { key: "alt", input: "7" }],
            [[27, 56], { key: "alt", input: "8" }],
            [[27, 57], { key: "alt", input: "9" }],
            [[27, 58], { key: "alt", input: ":" }],
            [[27, 59], { key: "alt", input: ";" }],
            [[27, 60], { key: "alt", input: "<" }],
            [[27, 61], { key: "alt", input: "=" }],
            [[27, 62], { key: "alt", input: ">" }],
            [[27, 63], { key: "alt", input: "?" }],
            [[27, 64], { key: "alt", input: "@" }],
            [[27, 91], { key: "alt", input: "[" }],
            [[27, 92], { key: "alt", input: "\\" }],
            [[27, 93], { key: "alt", input: "]" }],
            [[27, 94], { key: "alt", input: "^" }],
            [[27, 95], { key: "alt", input: "_" }],
            [[27, 96], { key: "alt", input: "`" }],
            [[27, 123], { key: "alt", input: "{" }],
            [[27, 124], { key: "alt", input: "|" }],
            [[27, 125], { key: "alt", input: "}" }],
            [[27, 126], { key: "alt", input: "~" }],
            // 127
        ])("buffer %o => %o", (buf, keymap) => {
            expect(checkParse(buf, keymap)).toBe(true);
        });
    });
});
