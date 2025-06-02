import { describe, test, expect } from "vitest";
import { checkParse } from "../helpers/checkParse.js";

describe("Kitty protocol", () => {
    test("Lowercase alphabet", () => {
        expect(checkParse("\x1b[97u", { input: "a" })).toBe(true);
        expect(checkParse("\x1b[98u", { input: "b" })).toBe(true);
        expect(checkParse("\x1b[99u", { input: "c" })).toBe(true);
        expect(checkParse("\x1b[100u", { input: "d" })).toBe(true);
        expect(checkParse("\x1b[101u", { input: "e" })).toBe(true);
        expect(checkParse("\x1b[102u", { input: "f" })).toBe(true);
        expect(checkParse("\x1b[103u", { input: "g" })).toBe(true);
        expect(checkParse("\x1b[104u", { input: "h" })).toBe(true);
        expect(checkParse("\x1b[105u", { input: "i" })).toBe(true);
        expect(checkParse("\x1b[106u", { input: "j" })).toBe(true);
        expect(checkParse("\x1b[107u", { input: "k" })).toBe(true);
        expect(checkParse("\x1b[108u", { input: "l" })).toBe(true);
        expect(checkParse("\x1b[109u", { input: "m" })).toBe(true);
        expect(checkParse("\x1b[110u", { input: "n" })).toBe(true);
        expect(checkParse("\x1b[111u", { input: "o" })).toBe(true);
        expect(checkParse("\x1b[112u", { input: "p" })).toBe(true);
        expect(checkParse("\x1b[113u", { input: "q" })).toBe(true);
        expect(checkParse("\x1b[114u", { input: "r" })).toBe(true);
        expect(checkParse("\x1b[115u", { input: "s" })).toBe(true);
        expect(checkParse("\x1b[116u", { input: "t" })).toBe(true);
        expect(checkParse("\x1b[117u", { input: "u" })).toBe(true);
        expect(checkParse("\x1b[118u", { input: "v" })).toBe(true);
        expect(checkParse("\x1b[119u", { input: "w" })).toBe(true);
        expect(checkParse("\x1b[120u", { input: "x" })).toBe(true);
        expect(checkParse("\x1b[121u", { input: "y" })).toBe(true);
        expect(checkParse("\x1b[122u", { input: "z" })).toBe(true);
    });

    test("Uppercase alphabet (shift added to modifiers bit field but not to data.key)", () => {
        expect(checkParse("\x1b[97;2u", { input: "A" })).toBe(true);
        expect(checkParse("\x1b[98;2u", { input: "B" })).toBe(true);
        expect(checkParse("\x1b[99;2u", { input: "C" })).toBe(true);
        expect(checkParse("\x1b[100;2u", { input: "D" })).toBe(true);
        expect(checkParse("\x1b[101;2u", { input: "E" })).toBe(true);
        expect(checkParse("\x1b[102;2u", { input: "F" })).toBe(true);
        expect(checkParse("\x1b[103;2u", { input: "G" })).toBe(true);
        expect(checkParse("\x1b[104;2u", { input: "H" })).toBe(true);
        expect(checkParse("\x1b[105;2u", { input: "I" })).toBe(true);
        expect(checkParse("\x1b[106;2u", { input: "J" })).toBe(true);
        expect(checkParse("\x1b[107;2u", { input: "K" })).toBe(true);
        expect(checkParse("\x1b[108;2u", { input: "L" })).toBe(true);
        expect(checkParse("\x1b[109;2u", { input: "M" })).toBe(true);
        expect(checkParse("\x1b[110;2u", { input: "N" })).toBe(true);
        expect(checkParse("\x1b[111;2u", { input: "O" })).toBe(true);
        expect(checkParse("\x1b[112;2u", { input: "P" })).toBe(true);
        expect(checkParse("\x1b[113;2u", { input: "Q" })).toBe(true);
        expect(checkParse("\x1b[114;2u", { input: "R" })).toBe(true);
        expect(checkParse("\x1b[115;2u", { input: "S" })).toBe(true);
        expect(checkParse("\x1b[116;2u", { input: "T" })).toBe(true);
        expect(checkParse("\x1b[117;2u", { input: "U" })).toBe(true);
        expect(checkParse("\x1b[118;2u", { input: "V" })).toBe(true);
        expect(checkParse("\x1b[119;2u", { input: "W" })).toBe(true);
        expect(checkParse("\x1b[120;2u", { input: "X" })).toBe(true);
        expect(checkParse("\x1b[121;2u", { input: "Y" })).toBe(true);
        expect(checkParse("\x1b[122;2u", { input: "Z" })).toBe(true);
    });

    // prettier-ignore
    test("Numeric and symbol keys", () => {
        expect(checkParse("\x1b[32u", { input: String.fromCharCode(32) })).toBe(true);
        expect(checkParse("\x1b[33u", { input: String.fromCharCode(33) })).toBe(true);
        expect(checkParse("\x1b[34u", { input: String.fromCharCode(34) })).toBe(true);
        expect(checkParse("\x1b[35u", { input: String.fromCharCode(35) })).toBe(true);
        expect(checkParse("\x1b[36u", { input: String.fromCharCode(36) })).toBe(true);
        expect(checkParse("\x1b[37u", { input: String.fromCharCode(37) })).toBe(true);
        expect(checkParse("\x1b[38u", { input: String.fromCharCode(38) })).toBe(true);
        expect(checkParse("\x1b[39u", { input: String.fromCharCode(39) })).toBe(true);
        expect(checkParse("\x1b[40u", { input: String.fromCharCode(40) })).toBe(true);
        expect(checkParse("\x1b[41u", { input: String.fromCharCode(41) })).toBe(true);
        expect(checkParse("\x1b[42u", { input: String.fromCharCode(42) })).toBe(true);
        expect(checkParse("\x1b[43u", { input: String.fromCharCode(43) })).toBe(true);
        expect(checkParse("\x1b[44u", { input: String.fromCharCode(44) })).toBe(true);
        expect(checkParse("\x1b[45u", { input: String.fromCharCode(45) })).toBe(true);
        expect(checkParse("\x1b[46u", { input: String.fromCharCode(46) })).toBe(true);
        expect(checkParse("\x1b[47u", { input: String.fromCharCode(47) })).toBe(true);
        expect(checkParse("\x1b[48u", { input: String.fromCharCode(48) })).toBe(true);
        expect(checkParse("\x1b[49u", { input: String.fromCharCode(49) })).toBe(true);
        expect(checkParse("\x1b[50u", { input: String.fromCharCode(50) })).toBe(true);
        expect(checkParse("\x1b[51u", { input: String.fromCharCode(51) })).toBe(true);
        expect(checkParse("\x1b[52u", { input: String.fromCharCode(52) })).toBe(true);
        expect(checkParse("\x1b[53u", { input: String.fromCharCode(53) })).toBe(true);
        expect(checkParse("\x1b[54u", { input: String.fromCharCode(54) })).toBe(true);
        expect(checkParse("\x1b[55u", { input: String.fromCharCode(55) })).toBe(true);
        expect(checkParse("\x1b[56u", { input: String.fromCharCode(56) })).toBe(true);
        expect(checkParse("\x1b[57u", { input: String.fromCharCode(57) })).toBe(true);
        expect(checkParse("\x1b[58u", { input: String.fromCharCode(58) })).toBe(true);
        expect(checkParse("\x1b[59u", { input: String.fromCharCode(59) })).toBe(true);
        expect(checkParse("\x1b[60u", { input: String.fromCharCode(60) })).toBe(true);
        expect(checkParse("\x1b[61u", { input: String.fromCharCode(61) })).toBe(true);
        expect(checkParse("\x1b[62u", { input: String.fromCharCode(62) })).toBe(true);
        expect(checkParse("\x1b[63u", { input: String.fromCharCode(63) })).toBe(true);
        expect(checkParse("\x1b[64u", { input: String.fromCharCode(64) })).toBe(true);

        expect(checkParse("\x1b[91u", { input: String.fromCharCode(91) })).toBe(true);
        expect(checkParse("\x1b[92u", { input: String.fromCharCode(92) })).toBe(true);
        expect(checkParse("\x1b[93u", { input: String.fromCharCode(93) })).toBe(true);
        expect(checkParse("\x1b[94u", { input: String.fromCharCode(94) })).toBe(true);
        expect(checkParse("\x1b[95u", { input: String.fromCharCode(95) })).toBe(true);
        expect(checkParse("\x1b[96u", { input: String.fromCharCode(96) })).toBe(true);

        expect(checkParse("\x1b[123u", { input: String.fromCharCode(123) })).toBe(true);
        expect(checkParse("\x1b[124u", { input: String.fromCharCode(124) })).toBe(true);
        expect(checkParse("\x1b[125u", { input: String.fromCharCode(125) })).toBe(true);
        expect(checkParse("\x1b[126u", { input: String.fromCharCode(126) })).toBe(true);
    });

    describe("capsLock modifies letters but is not added to data.keys", () => {
        test("Letter with capsLock", () => {
            expect(checkParse("\x1b[97;65u", { input: "A" })).toBe(true);
        });
        test("Number with capsLock", () => {
            expect(checkParse("\x1b[49;65u", { input: "1" })).toBe(true);
        });

        test("Letter with capsLock & numLock", () => {
            expect(checkParse("\x1b[97;193u", { input: "A" })).toBe(true);
        });

        test("Number with capsLock & numLock", () => {
            expect(checkParse("\x1b[49;193u", { input: "1" })).toBe(true);
        });
    });

    // prettier-ignore
    test("CSI keycode ; modifier u", () => {
        expect(checkParse("\x1b[97;3u", { key: "alt", input: "a" })).toBe(true);
        expect(checkParse("\x1b[97;4u", { key: "alt", input: "A" })).toBe(true);
        expect(checkParse("\x1b[97;5u", { key: "ctrl", input: "a" })).toBe(true);
        expect(checkParse("\x1b[97;6u", { key: "ctrl", input: "A" })).toBe(true);
        expect(checkParse("\x1b[97;7u", { key: ["ctrl", "alt"], input: "a" })).toBe(true);
    });

    // prettier-ignore
    describe("keys part of modifier byte, but are selectively applied to data.keys", () => {
        test("shift without input is added", () => {
            expect(checkParse("\x1b[57441u", { key: "shift" })).toBe(true);
        });
        test("shift is added when combined with other keys", () => {
            expect(checkParse("\x1b[1;4A", { key: ["shift", "alt", "up"] })).toBe(true);
        });
        test("shift with input is not added", () => {
            expect(checkParse("\x1b[97;2u", { input: "A" })).toBe(true);
        });
        test("numLock as a modifier is not added", () => {
            expect(checkParse("\x1b[97;129u", { input: "a" })).toBe(true);
        });
        test("numLock as a single keypress is not added", () => {
            expect(checkParse("\x1b57360u", {})).toBe(true);
        });
        test("capsLock as a modifier is not added", () => {
            expect(checkParse("\x1b[57358u", {})).toBe(true);
        });
        test("capsLock as a modifier is not added", () => {
            expect(checkParse("\x1b[97;65u", { input: "A" })).toBe(true);
        });
    });
});
