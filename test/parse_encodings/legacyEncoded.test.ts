import { describe, test, expect } from "vitest";
import { checkParse } from "../helpers/checkParse.js";

describe("LegacyKeyMap", () => {
    test("LegacyKeyMap", () => {
        expect(checkParse("\x1bOP", { key: "f1" })).toBe(true);
        expect(checkParse("\x1bOQ", { key: "f2" })).toBe(true);
        expect(checkParse("\x1bOR", { key: "f3" })).toBe(true);
        expect(checkParse("\x1bOS", { key: "f4" })).toBe(true);
        expect(checkParse("\x1b[15~", { key: "f5" })).toBe(true);
        expect(checkParse("\x1b[17~", { key: "f6" })).toBe(true);
        expect(checkParse("\x1b[18~", { key: "f7" })).toBe(true);
        expect(checkParse("\x1b[19~", { key: "f8" })).toBe(true);
        expect(checkParse("\x1b[20~", { key: "f9" })).toBe(true);
        expect(checkParse("\x1b[21~", { key: "f10" })).toBe(true);
        expect(checkParse("\x1b[23~", { key: "f11" })).toBe(true);
        expect(checkParse("\x1b[24~", { key: "f12" })).toBe(true);
        expect(checkParse("\x1b[3~", { key: "delete" })).toBe(true);
        expect(checkParse("\x1b[2~", { key: "insert" })).toBe(true);
        expect(checkParse("\x1b[A", { key: "up" })).toBe(true);
        expect(checkParse("\x1b[B", { key: "down" })).toBe(true);
        expect(checkParse("\x1b[C", { key: "right" })).toBe(true);
        expect(checkParse("\x1b[D", { key: "left" })).toBe(true);
        expect(checkParse("\x1b[5~", { key: "pageUp" })).toBe(true);
        expect(checkParse("\x1b[6~", { key: "pageDown" })).toBe(true);
        expect(checkParse("\x1b[F", { key: "end" })).toBe(true);
        expect(checkParse("\x1b[8~", { key: "end" })).toBe(true);
        expect(checkParse("\x1b[H", { key: "home" })).toBe(true);
        expect(checkParse("\x1b[7~", { key: "home" })).toBe(true);
    });

    test("backspace should not be handled by xterm parsing and is ambiguous", () => {
        // This gets handled since \x7F === byte 127
        expect(checkParse("\x7F", { key: "backspace" })).toBe(false);
    });
});

// prettier-ignore
describe("CSI number ; modifier {ABCDHFPQRS~} ", () => {
    test("alt + {ABCDHFPQRS}", () => {
        expect(checkParse("\x1b[1;3A", { key: ["alt", "up"] })).toBe(true);
        expect(checkParse("\x1b[1;3B", { key: ["alt", "down"] })).toBe(true);
        expect(checkParse("\x1b[1;3C", { key: ["alt", "right"] })).toBe(true);
        expect(checkParse("\x1b[1;3D", { key: ["alt", "left"] })).toBe(true);
        expect(checkParse("\x1b[1;3H", { key: ["alt", "home"] })).toBe(true);
        expect(checkParse("\x1b[1;3F", { key: ["alt", "end"] })).toBe(true);
        expect(checkParse("\x1b[1;3P", { key: ["alt", "f1"] })).toBe(true);
        expect(checkParse("\x1b[1;3Q", { key: ["alt", "f2"] })).toBe(true);
        expect(checkParse("\x1b[1;3R", { key: ["alt", "f3"] })).toBe(true);
        expect(checkParse("\x1b[1;3S", { key: ["alt", "f4"] })).toBe(true);
    })

    test("ctrl + {ABCDHFPQRS}", () => {
        expect(checkParse("\x1b[1;5A", { key: ["ctrl", "up"] })).toBe(true);
        expect(checkParse("\x1b[1;5B", { key: ["ctrl", "down"] })).toBe(true);
        expect(checkParse("\x1b[1;5C", { key: ["ctrl", "right"] })).toBe(true);
        expect(checkParse("\x1b[1;5D", { key: ["ctrl", "left"] })).toBe(true);
        expect(checkParse("\x1b[1;5H", { key: ["ctrl", "home"] })).toBe(true);
        expect(checkParse("\x1b[1;5F", { key: ["ctrl", "end"] })).toBe(true);
        expect(checkParse("\x1b[1;5P", { key: ["ctrl", "f1"] })).toBe(true);
        expect(checkParse("\x1b[1;5Q", { key: ["ctrl", "f2"] })).toBe(true);
        expect(checkParse("\x1b[1;5R", { key: ["ctrl", "f3"] })).toBe(true);
        expect(checkParse("\x1b[1;5S", { key: ["ctrl", "f4"] })).toBe(true);
    })

    test("ctrl + alt + {ABCDHFPQRS}", () => {
        expect(checkParse("\x1b[1;7A", { key: ["ctrl", "alt", "up"] })).toBe(true);
        expect(checkParse("\x1b[1;7B", { key: ["ctrl", "alt", "down"] })).toBe(true);
        expect(checkParse("\x1b[1;7C", { key: ["ctrl", "alt", "right"] })).toBe(true);
        expect(checkParse("\x1b[1;7D", { key: ["ctrl", "alt", "left"] })).toBe(true);
        expect(checkParse("\x1b[1;7H", { key: ["ctrl", "alt", "home"] })).toBe(true);
        expect(checkParse("\x1b[1;7F", { key: ["ctrl", "alt", "end"] })).toBe(true);
        expect(checkParse("\x1b[1;7P", { key: ["ctrl", "alt", "f1"] })).toBe(true);
        expect(checkParse("\x1b[1;7Q", { key: ["ctrl", "alt", "f2"] })).toBe(true);
        expect(checkParse("\x1b[1;7R", { key: ["ctrl", "alt", "f3"] })).toBe(true);
        expect(checkParse("\x1b[1;7S", { key: ["ctrl", "alt", "f4"] })).toBe(true);
    })

    test("CSI number ; alt ~ (number is mapped to a key)", () => {
        expect(checkParse("\x1b[15;3~", { key: ["alt", "f5"] })).toBe(true);
        expect(checkParse("\x1b[17;3~", { key: ["alt", "f6"] })).toBe(true);
        expect(checkParse("\x1b[18;3~", { key: ["alt", "f7"] })).toBe(true);
        expect(checkParse("\x1b[19;3~", { key: ["alt", "f8"] })).toBe(true);
        expect(checkParse("\x1b[20;3~", { key: ["alt", "f9"] })).toBe(true);
        expect(checkParse("\x1b[21;3~", { key: ["alt", "f10"] })).toBe(true);
        expect(checkParse("\x1b[23;3~", { key: ["alt", "f11"] })).toBe(true);
        expect(checkParse("\x1b[24;3~", { key: ["alt", "f12"] })).toBe(true);
        expect(checkParse("\x1b[2;3~", { key: ["alt", "insert"] })).toBe(true);
        expect(checkParse("\x1b[3;3~", { key: ["alt", "delete"] })).toBe(true);
        expect(checkParse("\x1b[5;3~", { key: ["alt", "pageUp"] })).toBe(true);
        expect(checkParse("\x1b[6;3~", { key: ["alt", "pageDown"] })).toBe(true);
    })

    test("CSI number ; ctrl ~ (number is mapped to a key)", () => {
        expect(checkParse("\x1b[15;5~", { key: ["ctrl", "f5"] })).toBe(true);
        expect(checkParse("\x1b[17;5~", { key: ["ctrl", "f6"] })).toBe(true);
        expect(checkParse("\x1b[18;5~", { key: ["ctrl", "f7"] })).toBe(true);
        expect(checkParse("\x1b[19;5~", { key: ["ctrl", "f8"] })).toBe(true);
        expect(checkParse("\x1b[20;5~", { key: ["ctrl", "f9"] })).toBe(true);
        expect(checkParse("\x1b[21;5~", { key: ["ctrl", "f10"] })).toBe(true);
        expect(checkParse("\x1b[23;5~", { key: ["ctrl", "f11"] })).toBe(true);
        expect(checkParse("\x1b[24;5~", { key: ["ctrl", "f12"] })).toBe(true);
        expect(checkParse("\x1b[2;5~", { key: ["ctrl", "insert"] })).toBe(true);
        expect(checkParse("\x1b[3;5~", { key: ["ctrl", "delete"] })).toBe(true);
        expect(checkParse("\x1b[5;5~", { key: ["ctrl", "pageUp"] })).toBe(true);
        expect(checkParse("\x1b[6;5~", { key: ["ctrl", "pageDown"] })).toBe(true);
    })

    test("CSI number ; (ctrl + alt) ~", () => {
        expect(checkParse("\x1b[15;7~", { key: ["ctrl", "alt", "f5"] })).toBe(true);
        expect(checkParse("\x1b[17;7~", { key: ["ctrl", "alt", "f6"] })).toBe(true);
        expect(checkParse("\x1b[18;7~", { key: ["ctrl", "alt", "f7"] })).toBe(true);
        expect(checkParse("\x1b[19;7~", { key: ["ctrl", "alt", "f8"] })).toBe(true);
        expect(checkParse("\x1b[20;7~", { key: ["ctrl", "alt", "f9"] })).toBe(true);
        expect(checkParse("\x1b[21;7~", { key: ["ctrl", "alt", "f10"] })).toBe(true);
        expect(checkParse("\x1b[23;7~", { key: ["ctrl", "alt", "f11"] })).toBe(true);
        expect(checkParse("\x1b[24;7~", { key: ["ctrl", "alt", "f12"] })).toBe(true);
        expect(checkParse("\x1b[2;7~", { key: ["ctrl", "alt", "insert"] })).toBe(true);
        expect(checkParse("\x1b[3;7~", { key: ["ctrl", "alt", "delete"] })).toBe(true);
        expect(checkParse("\x1b[5;7~", { key: ["ctrl", "alt", "pageUp"] })).toBe(true);
        expect(checkParse("\x1b[6;7~", { key: ["ctrl", "alt", "pageDown"] })).toBe(true);
    })

    test("CSI 1 ; modifier {ABCDHFPQRS~} with kitty support", () => {
        expect(checkParse("\x1b[1;16A", { key: ["shift", "alt", "ctrl", "super", "up"] })).toBe(true);
        expect(checkParse("\x1b[6;16~", { key: ["shift", "alt", "ctrl", "super", "pageDown"] })).toBe(true);
    })
})
