import { describe, test, expect } from "vitest";
import { checkParse } from "../helpers/checkParse.js";
import { KeyMap } from "../../src/stateful/match.js";

// Since we are testing CSI and SS3 sequences, just use escape
const ESC = "\x1b";

describe("LegacyKeyMap", () => {
    test.each<[string, KeyMap]>([
        ["OP", { key: "f1" }],
        ["OQ", { key: "f2" }],
        ["OR", { key: "f3" }],
        ["OS", { key: "f4" }],
    ])("\\x1b%s => %o", (csi, keymap) => {
        expect(checkParse("\x1b" + csi, keymap)).toBe(true);
    });
    test.each<[string, KeyMap]>([
        ["[15~", { key: "f5" }],
        ["[17~", { key: "f6" }],
        ["[18~", { key: "f7" }],
        ["[19~", { key: "f8" }],
        ["[20~", { key: "f9" }],
        ["[21~", { key: "f10" }],
        ["[23~", { key: "f11" }],
        ["[24~", { key: "f12" }],
        ["[3~", { key: "delete" }],
        ["[2~", { key: "insert" }],
        ["[A", { key: "up" }],
        ["[B", { key: "down" }],
        ["[C", { key: "right" }],
        ["[D", { key: "left" }],
        ["[5~", { key: "pageUp" }],
        ["[6~", { key: "pageDown" }],
        ["[F", { key: "end" }],
        ["[8~", { key: "end" }],
        ["[H", { key: "home" }],
        ["[7~", { key: "home" }],
    ])("\\x1b%s => %o", (csi, keymap) => {
        expect(checkParse(ESC + csi, keymap)).toBe(true);
    });

    test("backspace should not be handled by xterm parsing and is ambiguous", () => {
        // This gets handled since \x7F === byte 127
        expect(checkParse("\x7F", { key: "backspace" })).toBe(false);
    });
});

describe("CSI number ; modifier {ABCDHFPQRS~} ", () => {
    describe("alt + {ABCDHFPQRS}", () => {
        test.each<[string, KeyMap]>([
            ["[1;3A", { key: ["alt", "up"] }],
            ["[1;3B", { key: ["alt", "down"] }],
            ["[1;3C", { key: ["alt", "right"] }],
            ["[1;3D", { key: ["alt", "left"] }],
            ["[1;3H", { key: ["alt", "home"] }],
            ["[1;3F", { key: ["alt", "end"] }],
            ["[1;3P", { key: ["alt", "f1"] }],
            ["[1;3Q", { key: ["alt", "f2"] }],
            ["[1;3R", { key: ["alt", "f3"] }],
            ["[1;3S", { key: ["alt", "f4"] }],
        ])("%s => %o", (csi, keymap) => {
            expect(checkParse(ESC + csi, keymap)).toBe(true);
        });
    });

    describe("ctrl + {ABCDHFPQRS}", () => {
        test.each<[string, KeyMap]>([
            ["[1;5A", { key: ["ctrl", "up"] }],
            ["[1;5B", { key: ["ctrl", "down"] }],
            ["[1;5C", { key: ["ctrl", "right"] }],
            ["[1;5D", { key: ["ctrl", "left"] }],
            ["[1;5H", { key: ["ctrl", "home"] }],
            ["[1;5F", { key: ["ctrl", "end"] }],
            ["[1;5P", { key: ["ctrl", "f1"] }],
            ["[1;5Q", { key: ["ctrl", "f2"] }],
            ["[1;5R", { key: ["ctrl", "f3"] }],
            ["[1;5S", { key: ["ctrl", "f4"] }],
        ])("%s => %o", (csi, keymap) => {
            expect(checkParse(ESC + csi, keymap)).toBe(true);
        });
    });

    describe("ctrl + alt + {ABCDHFPQRS}", () => {
        test.each<[string, KeyMap]>([
            ["[1;7A", { key: ["ctrl", "alt", "up"] }],
            ["[1;7B", { key: ["ctrl", "alt", "down"] }],
            ["[1;7C", { key: ["ctrl", "alt", "right"] }],
            ["[1;7D", { key: ["ctrl", "alt", "left"] }],
            ["[1;7H", { key: ["ctrl", "alt", "home"] }],
            ["[1;7F", { key: ["ctrl", "alt", "end"] }],
            ["[1;7P", { key: ["ctrl", "alt", "f1"] }],
            ["[1;7Q", { key: ["ctrl", "alt", "f2"] }],
            ["[1;7R", { key: ["ctrl", "alt", "f3"] }],
            ["[1;7S", { key: ["ctrl", "alt", "f4"] }],
        ])("%s => %o", (csi, keymap) => {
            expect(checkParse(ESC + csi, keymap)).toBe(true);
        });
    });

    describe("CSI number ; alt ~ (number is mapped to a key)", () => {
        test.each<[string, KeyMap]>([
            ["[15;3~", { key: ["alt", "f5"] }],
            ["[17;3~", { key: ["alt", "f6"] }],
            ["[18;3~", { key: ["alt", "f7"] }],
            ["[19;3~", { key: ["alt", "f8"] }],
            ["[20;3~", { key: ["alt", "f9"] }],
            ["[21;3~", { key: ["alt", "f10"] }],
            ["[23;3~", { key: ["alt", "f11"] }],
            ["[24;3~", { key: ["alt", "f12"] }],
            ["[2;3~", { key: ["alt", "insert"] }],
            ["[3;3~", { key: ["alt", "delete"] }],
            ["[5;3~", { key: ["alt", "pageUp"] }],
            ["[6;3~", { key: ["alt", "pageDown"] }],
        ])("\\x1b%s => %o", (csi, keymap) => {
            expect(checkParse(ESC + csi, keymap)).toBe(true);
        });
    });

    describe("CSI number ; ctrl ~ (number is mapped to a key)", () => {
        test.each<[string, KeyMap]>([
            ["[15;5~", { key: ["ctrl", "f5"] }],
            ["[17;5~", { key: ["ctrl", "f6"] }],
            ["[18;5~", { key: ["ctrl", "f7"] }],
            ["[19;5~", { key: ["ctrl", "f8"] }],
            ["[20;5~", { key: ["ctrl", "f9"] }],
            ["[21;5~", { key: ["ctrl", "f10"] }],
            ["[23;5~", { key: ["ctrl", "f11"] }],
            ["[24;5~", { key: ["ctrl", "f12"] }],
            ["[2;5~", { key: ["ctrl", "insert"] }],
            ["[3;5~", { key: ["ctrl", "delete"] }],
            ["[5;5~", { key: ["ctrl", "pageUp"] }],
            ["[6;5~", { key: ["ctrl", "pageDown"] }],
        ])("\\x1b%s => %o", (csi, keymap) => {
            expect(checkParse(ESC + csi, keymap)).toBe(true);
        });
    });

    describe("CSI number ; (ctrl + alt) ~", () => {
        test.each<[string, KeyMap]>([
            ["[15;7~", { key: ["ctrl", "alt", "f5"] }],
            ["[17;7~", { key: ["ctrl", "alt", "f6"] }],
            ["[18;7~", { key: ["ctrl", "alt", "f7"] }],
            ["[19;7~", { key: ["ctrl", "alt", "f8"] }],
            ["[20;7~", { key: ["ctrl", "alt", "f9"] }],
            ["[21;7~", { key: ["ctrl", "alt", "f10"] }],
            ["[23;7~", { key: ["ctrl", "alt", "f11"] }],
            ["[24;7~", { key: ["ctrl", "alt", "f12"] }],
            ["[2;7~", { key: ["ctrl", "alt", "insert"] }],
            ["[3;7~", { key: ["ctrl", "alt", "delete"] }],
            ["[5;7~", { key: ["ctrl", "alt", "pageUp"] }],
            ["[6;7~", { key: ["ctrl", "alt", "pageDown"] }],
        ])("\\x1b%s => %o", (csi, keymap) => {
            expect(checkParse(ESC + csi, keymap)).toBe(true);
        });
    });

    describe("CSI 1 ; modifier {ABCDHFQPRS} with kitty support", () => {
        test.each<[string, KeyMap]>([
            ["[1;16A", { key: ["alt", "shift", "ctrl", "super", "up"] }],
            ["[1;16B", { key: ["alt", "shift", "ctrl", "super", "down"] }],
            ["[1;16C", { key: ["alt", "shift", "ctrl", "super", "right"] }],
            ["[1;16D", { key: ["alt", "shift", "ctrl", "super", "left"] }],
            ["[1;16H", { key: ["alt", "shift", "ctrl", "super", "home"] }],
            ["[1;16F", { key: ["alt", "shift", "ctrl", "super", "end"] }],
            ["[1;16P", { key: ["alt", "shift", "ctrl", "super", "f1"] }],
            ["[1;16Q", { key: ["alt", "shift", "ctrl", "super", "f2"] }],
            ["[1;16R", { key: ["alt", "shift", "ctrl", "super", "f3"] }],
            ["[1;16S", { key: ["alt", "shift", "ctrl", "super", "f4"] }],
        ])("\\x1b%s => %o", (csi, keymap) => {
            expect(checkParse(ESC + csi, keymap)).toBe(true);
        });
    });

    describe("CSI 1 ; modifier ~ with kitty support", () => {
        test.each<[string, KeyMap]>([
            ["[15;16~", { key: ["alt", "shift", "ctrl", "super", "f5"] }],
            ["[17;16~", { key: ["alt", "shift", "ctrl", "super", "f6"] }],
            ["[18;16~", { key: ["alt", "shift", "ctrl", "super", "f7"] }],
            ["[19;16~", { key: ["alt", "shift", "ctrl", "super", "f8"] }],
            ["[20;16~", { key: ["alt", "shift", "ctrl", "super", "f9"] }],
            ["[21;16~", { key: ["alt", "shift", "ctrl", "super", "f10"] }],
            ["[23;16~", { key: ["alt", "shift", "ctrl", "super", "f11"] }],
            ["[24;16~", { key: ["alt", "shift", "ctrl", "super", "f12"] }],
            ["[2;16~", { key: ["alt", "shift", "ctrl", "super", "insert"] }],
            ["[3;16~", { key: ["alt", "shift", "ctrl", "super", "delete"] }],
            ["[5;16~", { key: ["alt", "shift", "ctrl", "super", "pageUp"] }],
            ["[6;16~", { key: ["alt", "shift", "ctrl", "super", "pageDown"] }],
        ])("\\x1b%s => %o", (csi, keymap) => {
            expect(checkParse(ESC + csi, keymap)).toBe(true);
        });
    });
});
