import { describe, test, expect } from "vitest";
import { checkParse } from "../helpers/checkParse.js";
import { KeyMap } from "../../src/stateful/match.js";
import { parseBuffer } from "../../src/parse/parseBuffer.js";

const CSI = "\x1b[";

describe("Kitty protocol", () => {
    describe("Lowercase alphabet", () => {
        test.each([
            ["97u", { input: "a" }],
            ["98u", { input: "b" }],
            ["99u", { input: "c" }],
            ["100u", { input: "d" }],
            ["101u", { input: "e" }],
            ["102u", { input: "f" }],
            ["103u", { input: "g" }],
            ["104u", { input: "h" }],
            ["105u", { input: "i" }],
            ["106u", { input: "j" }],
            ["107u", { input: "k" }],
            ["108u", { input: "l" }],
            ["109u", { input: "m" }],
            ["110u", { input: "n" }],
            ["111u", { input: "o" }],
            ["112u", { input: "p" }],
            ["113u", { input: "q" }],
            ["114u", { input: "r" }],
            ["115u", { input: "s" }],
            ["116u", { input: "t" }],
            ["117u", { input: "u" }],
            ["118u", { input: "v" }],
            ["119u", { input: "w" }],
            ["120u", { input: "x" }],
            ["121u", { input: "y" }],
            ["122u", { input: "z" }],
        ])("\\x1b%s => %o", (csi, keymap) => {
            expect(checkParse(CSI + csi, keymap)).toBe(true);
        });
    });

    describe("Uppcase alphabet shift is part of modifier bitfield but not added to data.key", () => {
        test.each([
            ["97;2u", { input: "A" }],
            ["98;2u", { input: "B" }],
            ["99;2u", { input: "C" }],
            ["100;2u", { input: "D" }],
            ["101;2u", { input: "E" }],
            ["102;2u", { input: "F" }],
            ["103;2u", { input: "G" }],
            ["104;2u", { input: "H" }],
            ["105;2u", { input: "I" }],
            ["106;2u", { input: "J" }],
            ["107;2u", { input: "K" }],
            ["108;2u", { input: "L" }],
            ["109;2u", { input: "M" }],
            ["110;2u", { input: "N" }],
            ["111;2u", { input: "O" }],
            ["112;2u", { input: "P" }],
            ["113;2u", { input: "Q" }],
            ["114;2u", { input: "R" }],
            ["115;2u", { input: "S" }],
            ["116;2u", { input: "T" }],
            ["117;2u", { input: "U" }],
            ["118;2u", { input: "V" }],
            ["119;2u", { input: "W" }],
            ["120;2u", { input: "X" }],
            ["121;2u", { input: "Y" }],
            ["122;2u", { input: "Z" }],
        ])("\\x1b%s => %o", (csi, keymap) => {
            expect(checkParse(CSI + csi, keymap)).toBe(true);
        });
    });

    describe("Numeric and symbol keys", () => {
        test.each([
            ["32u", { input: String.fromCharCode(32) }],
            ["33u", { input: String.fromCharCode(33) }],
            ["34u", { input: String.fromCharCode(34) }],
            ["35u", { input: String.fromCharCode(35) }],
            ["36u", { input: String.fromCharCode(36) }],
            ["37u", { input: String.fromCharCode(37) }],
            ["38u", { input: String.fromCharCode(38) }],
            ["39u", { input: String.fromCharCode(39) }],
            ["40u", { input: String.fromCharCode(40) }],
            ["41u", { input: String.fromCharCode(41) }],
            ["42u", { input: String.fromCharCode(42) }],
            ["43u", { input: String.fromCharCode(43) }],
            ["44u", { input: String.fromCharCode(44) }],
            ["45u", { input: String.fromCharCode(45) }],
            ["46u", { input: String.fromCharCode(46) }],
            ["47u", { input: String.fromCharCode(47) }],
            ["48u", { input: String.fromCharCode(48) }],
            ["49u", { input: String.fromCharCode(49) }],
            ["50u", { input: String.fromCharCode(50) }],
            ["51u", { input: String.fromCharCode(51) }],
            ["52u", { input: String.fromCharCode(52) }],
            ["53u", { input: String.fromCharCode(53) }],
            ["54u", { input: String.fromCharCode(54) }],
            ["55u", { input: String.fromCharCode(55) }],
            ["56u", { input: String.fromCharCode(56) }],
            ["57u", { input: String.fromCharCode(57) }],
            ["58u", { input: String.fromCharCode(58) }],
            ["59u", { input: String.fromCharCode(59) }],
            ["60u", { input: String.fromCharCode(60) }],
            ["61u", { input: String.fromCharCode(61) }],
            ["62u", { input: String.fromCharCode(62) }],
            ["63u", { input: String.fromCharCode(63) }],
            ["64u", { input: String.fromCharCode(64) }],

            ["91u", { input: String.fromCharCode(91) }],
            ["92u", { input: String.fromCharCode(92) }],
            ["93u", { input: String.fromCharCode(93) }],
            ["94u", { input: String.fromCharCode(94) }],
            ["95u", { input: String.fromCharCode(95) }],
            ["96u", { input: String.fromCharCode(96) }],

            ["123u", { input: String.fromCharCode(123) }],
            ["124u", { input: String.fromCharCode(124) }],
            ["125u", { input: String.fromCharCode(125) }],
            ["126u", { input: String.fromCharCode(126) }],
        ])("\\x1b%s => %s", (csi, keymap) => {
            expect(checkParse(CSI + csi, keymap)).toBe(true);
        });
    });

    describe("capsLock as a modifier (never gets added to data.key)", () => {
        test.each([
            // capsLock only modifier
            ["97;65u", { input: "A" }],
            ["98;65u", { input: "B" }],
            ["99;65u", { input: "C" }],
            ["100;65u", { input: "D" }],
            ["101;65u", { input: "E" }],
            ["102;65u", { input: "F" }],
            ["103;65u", { input: "G" }],
            ["104;65u", { input: "H" }],
            ["105;65u", { input: "I" }],
            ["106;65u", { input: "J" }],
            ["107;65u", { input: "K" }],
            ["108;65u", { input: "L" }],
            ["109;65u", { input: "M" }],
            ["110;65u", { input: "N" }],
            ["111;65u", { input: "O" }],
            ["112;65u", { input: "P" }],
            ["113;65u", { input: "Q" }],
            ["114;65u", { input: "R" }],
            ["115;65u", { input: "S" }],
            ["116;65u", { input: "T" }],
            ["117;65u", { input: "U" }],
            ["118;65u", { input: "V" }],
            ["119;65u", { input: "W" }],
            ["120;65u", { input: "X" }],
            ["121;65u", { input: "Y" }],
            ["122;65u", { input: "Z" }],

            // capsLock + numLock modifier
            ["97;193u", { input: "A" }],
            ["98;193u", { input: "B" }],
            ["99;193u", { input: "C" }],
            ["100;193u", { input: "D" }],
            ["101;193u", { input: "E" }],
            ["102;193u", { input: "F" }],
            ["103;193u", { input: "G" }],
            ["104;193u", { input: "H" }],
            ["105;193u", { input: "I" }],
            ["106;193u", { input: "J" }],
            ["107;193u", { input: "K" }],
            ["108;193u", { input: "L" }],
            ["109;193u", { input: "M" }],
            ["110;193u", { input: "N" }],
            ["111;193u", { input: "O" }],
            ["112;193u", { input: "P" }],
            ["113;193u", { input: "Q" }],
            ["114;193u", { input: "R" }],
            ["115;193u", { input: "S" }],
            ["116;193u", { input: "T" }],
            ["117;193u", { input: "U" }],
            ["118;193u", { input: "V" }],
            ["119;193u", { input: "W" }],
            ["120;193u", { input: "X" }],
            ["121;193u", { input: "Y" }],
            ["122;193u", { input: "Z" }],
        ])(
            "capsLock (w/ or wo numLock upper cases letters \\x1b[%s %o",
            (csi, keymap) => {
                expect(checkParse(CSI + csi, keymap)).toBe(true);
            },
        );

        test("no effect on number", () => {
            expect(checkParse("\x1b[49;65u", { input: "1" })).toBe(true);
        });

        test("no effect on symbol", () => {
            expect(checkParse("\x1b[92;65u", { input: "\\" })).toBe(true);
        });

        test("capsLock && numLock together upercases letters", () => {
            expect(checkParse("\x1b[97;193u", { input: "A" })).toBe(true);
        });

        test("capsLock && numLock no effect on numbers", () => {
            expect(checkParse("\x1b[49;193u", { input: "1" })).toBe(true);
        });
    });

    // TODO - add more
    describe("CSI keycode ; modifier u", () => {
        test.each<[string, KeyMap]>([
            ["97;3u", { key: "alt", input: "a" }],
            ["97;4u", { key: "alt", input: "A" }],
            ["97;5u", { key: "ctrl", input: "a" }],
            ["97;6u", { key: "ctrl", input: "A" }],
            ["97;7u", { key: ["ctrl", "alt"], input: "a" }],
            ["97;15u", { key: ["ctrl", "alt", "super"], input: "a" }],
            ["97;16u", { key: ["ctrl", "alt", "super"], input: "A" }],
        ])("\\x1b[%s => %o", (csi, keymap) => {
            expect(checkParse(CSI + csi, keymap)).toBe(true);
        });
    });

    describe("CSI keycode ; modifier u (w/ capsLock)", () => {
        test.each<[string, KeyMap]>([
            ["97;65u", { input: "A" }],
            ["98;65u", { input: "B" }],
            ["99;65u", { input: "C" }],
        ])("\\x1b[%s => %o", (csi, keymap) => {
            expect(checkParse(CSI + csi, keymap)).toBe(true);
        });
    });

    describe("CSI keycode ; modifier u (numLock combinations)", () => {
        test.each<[string, KeyMap]>([
            ["97;129u", { input: "a" }],
            ["98;129u", { input: "b" }],
            ["99;129u", { input: "c" }],
        ])("\\x1b[%s => %o", (csi, keymap) => {
            expect(checkParse(CSI + csi, keymap)).toBe(true);
        });
    });

    describe("capsLock when paired with other modifiers besides numLock should not uppercase", () => {
        test.each<[string, KeyMap]>([
            ["97;69u", { key: "ctrl", input: "a" }],
            ["97;71u", { key: ["ctrl", "alt"], input: "a" }],
            ["97;79u", { key: ["ctrl", "alt", "super"], input: "a" }],
        ])("\\x1b[%s => %o", (csi, keymap) => {
            expect(checkParse(CSI + csi, keymap)).toBe(true);
        });
    });

    test("capsLock w/ only numLock uppercases letters", () => {
        expect(checkParse("\x1b[97;193u", { input: "A" })).toBe(true);
    });

    // prettier-ignore
    describe("Modifiers are selectively applied to data.keys", () => {
        test("numLock as a single keypress is not added", () => {
            const data = parseBuffer(Buffer.from("\x1b[57360u"));
            expect(!data.key.size && !data.input.size).toBe(true);
        });
        test("capsLock as a single keypress is not added", () => { 
            const data = parseBuffer(Buffer.from("\x1b[57358u"));
            expect(!data.key.size && !data.input.size).toBe(true);
        });
        test("shift without input is added", () => {
            expect(checkParse("\x1b[57441u", { key: "shift" })).toBe(true);
        });
        test("shift is added when combined with other keys and no input is given", () => {
            expect(checkParse("\x1b[1;4A", { key: ["shift", "alt", "up"] })).toBe(true);
        });
        test("shift with input is not added", () => {
            expect(checkParse("\x1b[97;2u", { input: "A" })).toBe(true);
        });
        test("numLock as a modifier is not added", () => {
            expect(checkParse("\x1b[97;129u", { input: "a" })).toBe(true);
        });
        test("capsLock as a modifier is not added", () => {
            expect(checkParse("\x1b[97;65u", { input: "A" })).toBe(true);
        });
    });
});
