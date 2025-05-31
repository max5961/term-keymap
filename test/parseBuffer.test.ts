import { describe, test, expect } from "vitest";
import { checkParse } from "./helpers/helpers";
import { parseBuffer } from "../src/parse/parseBuffer";

describe("helpers", () => {
    test("checkParse", () => {
        expect(checkParse("a", { input: "a" })).toBe(true);
        expect(checkParse([97], { input: "a" })).toBe(true);
        expect(checkParse("a", { input: "b" })).toBe(false);
        expect(checkParse([97], { input: "b" })).toBe(false);
        expect(checkParse("a", { input: "a", key: "ctrl" })).toBe(false);
        expect(checkParse([97], { input: "a", key: "ctrl" })).toBe(false);
    });
});

describe("buffers that aren't explicitly handled are encoded to utf and added to the input set", () => {
    test("pasted text", () => {
        const data = parseBuffer(Buffer.from("foobar", "utf-8"));
        expect(!data.key.size && data.input.only("foobar")).toBe(true);
    });

    test("unicode", () => {
        const unicodes = ["‼", "⁇", "Ξ", "↷", "⇒"];

        for (let i = 0; i < unicodes.length; ++i) {
            const data = parseBuffer(Buffer.from(unicodes[i], "utf-8"));
            expect(!data.key.size && data.input.only(unicodes[i])).toBe(true);
        }
    });
});

describe("edge cases", () => {
    test("empty buffer", () => {
        const data = parseBuffer(Buffer.from([]));
        expect(data.key.size).toBe(0);
        expect(data.input.size).toBe(0);
    });
});

describe("single bytes - legacy buffers 0-127", () => {
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

    test("non-alphabet - ambiguous expected false", () => {
        expect(checkParse([0], { key: "ctrl", input: " " })).toBe(false); // !
        expect(checkParse([1], { key: "ctrl", input: "a" })).toBe(true);
        expect(checkParse([2], { key: "ctrl", input: "b" })).toBe(true);
        expect(checkParse([3], { key: "ctrl", input: "c" })).toBe(true);
        expect(checkParse([4], { key: "ctrl", input: "d" })).toBe(true);
        expect(checkParse([5], { key: "ctrl", input: "e" })).toBe(true);
        expect(checkParse([6], { key: "ctrl", input: "f" })).toBe(true);
        expect(checkParse([7], { key: "ctrl", input: "g" })).toBe(true);
        expect(checkParse([8], { key: "ctrl", input: "h" })).toBe(false); // !
        expect(checkParse([9], { key: "ctrl", input: "i" })).toBe(false); // !
        expect(checkParse([10], { key: "ctrl", input: "j" })).toBe(true);
        expect(checkParse([11], { key: "ctrl", input: "k" })).toBe(true);
        expect(checkParse([12], { key: "ctrl", input: "l" })).toBe(true);
        expect(checkParse([13], { key: "ctrl", input: "m" })).toBe(false); // !
        expect(checkParse([14], { key: "ctrl", input: "n" })).toBe(true);
        expect(checkParse([15], { key: "ctrl", input: "o" })).toBe(true);
        expect(checkParse([16], { key: "ctrl", input: "p" })).toBe(true);
        expect(checkParse([17], { key: "ctrl", input: "q" })).toBe(true);
        expect(checkParse([18], { key: "ctrl", input: "r" })).toBe(true);
        expect(checkParse([19], { key: "ctrl", input: "s" })).toBe(true);
        expect(checkParse([20], { key: "ctrl", input: "t" })).toBe(true);
        expect(checkParse([21], { key: "ctrl", input: "u" })).toBe(true);
        expect(checkParse([22], { key: "ctrl", input: "v" })).toBe(true);
        expect(checkParse([23], { key: "ctrl", input: "w" })).toBe(true);
        expect(checkParse([24], { key: "ctrl", input: "x" })).toBe(true);
        expect(checkParse([25], { key: "ctrl", input: "y" })).toBe(true);
        expect(checkParse([26], { key: "ctrl", input: "z" })).toBe(true);
        expect(checkParse([27], { key: "esc" })).toBe(false); // !
        expect(checkParse([28], { key: "ctrl", input: "4" })).toBe(false); // !
        expect(checkParse([29], { key: "ctrl", input: "5" })).toBe(false); // !
        expect(checkParse([30], { key: "ctrl", input: "6" })).toBe(false); // !
        expect(checkParse([31], { key: "ctrl", input: "7" })).toBe(false); // !
        expect(checkParse([32], { input: " " })).toBe(true);
        expect(checkParse([33], { input: "!" })).toBe(true);
        expect(checkParse([34], { input: '"' })).toBe(true);
        expect(checkParse([35], { input: "#" })).toBe(true);
        expect(checkParse([36], { input: "$" })).toBe(true);
        expect(checkParse([37], { input: "%" })).toBe(true);
        expect(checkParse([38], { input: "&" })).toBe(true);
        expect(checkParse([39], { input: "'" })).toBe(true);
        expect(checkParse([40], { input: "(" })).toBe(true);
        expect(checkParse([41], { input: ")" })).toBe(true);
        expect(checkParse([42], { input: "*" })).toBe(true);
        expect(checkParse([43], { input: "+" })).toBe(true);
        expect(checkParse([44], { input: "," })).toBe(true);
        expect(checkParse([45], { input: "-" })).toBe(true);
        expect(checkParse([46], { input: "." })).toBe(true);
        expect(checkParse([47], { input: "/" })).toBe(true);
        expect(checkParse([48], { input: "0" })).toBe(true);
        expect(checkParse([49], { input: "1" })).toBe(true);
        expect(checkParse([50], { input: "2" })).toBe(true);
        expect(checkParse([51], { input: "3" })).toBe(true);
        expect(checkParse([52], { input: "4" })).toBe(true);
        expect(checkParse([53], { input: "5" })).toBe(true);
        expect(checkParse([54], { input: "6" })).toBe(true);
        expect(checkParse([55], { input: "7" })).toBe(true);
        expect(checkParse([56], { input: "8" })).toBe(true);
        expect(checkParse([57], { input: "9" })).toBe(true);
        expect(checkParse([58], { input: ":" })).toBe(true);
        expect(checkParse([59], { input: ";" })).toBe(true);
        expect(checkParse([60], { input: "<" })).toBe(true);
        expect(checkParse([61], { input: "=" })).toBe(true);
        expect(checkParse([62], { input: ">" })).toBe(true);
        expect(checkParse([63], { input: "?" })).toBe(true);
        expect(checkParse([64], { input: "@" })).toBe(true);
        expect(checkParse([91], { input: "[" })).toBe(true);
        expect(checkParse([92], { input: "\\" })).toBe(true);
        expect(checkParse([93], { input: "]" })).toBe(true);
        expect(checkParse([94], { input: "^" })).toBe(true);
        expect(checkParse([95], { input: "_" })).toBe(true);
        expect(checkParse([96], { input: "`" })).toBe(true);
        expect(checkParse([123], { input: "{" })).toBe(true);
        expect(checkParse([124], { input: "|" })).toBe(true);
        expect(checkParse([125], { input: "}" })).toBe(true);
        expect(checkParse([126], { input: "~" })).toBe(true);
        expect(checkParse([127], { key: "backspace" })).toBe(false); // !
    });

    // prettier-ignore
    test("ambiguous 0-127", () => {
        let data = parseBuffer(Buffer.from([0]));
        expect(data.key.only("ctrl") && data.input.only(" ", "2")).toBe(true);

        data = parseBuffer(Buffer.from([8]));
        expect(data.key.only("ctrl", "backspace") && data.input.only("h")).toBe(true);

        data = parseBuffer(Buffer.from([9]));
        expect(data.key.only("ctrl", "tab") && data.input.only("i")).toBe(true);

        data = parseBuffer(Buffer.from([13]));
        expect(data.key.only("ctrl", "return") && data.input.only("m")).toBe(true);

        data = parseBuffer(Buffer.from([27]));
        expect(data.key.only("ctrl", "esc") && data.input.only("3", "[")).toBe(true);

        data = parseBuffer(Buffer.from([28]));
        expect(data.key.only("ctrl") && data.input.only("4", "\\")).toBe(true);

        data = parseBuffer(Buffer.from([29]));
        expect(data.key.only("ctrl") && data.input.only("5", "]")).toBe(true);

        data = parseBuffer(Buffer.from([30]));
        expect(data.key.only("ctrl") && data.input.only("6", "^")).toBe(true);

        data = parseBuffer(Buffer.from([31]));
        expect(data.key.only("ctrl") && data.input.only("7", "/")).toBe(true);

        data = parseBuffer(Buffer.from([127]));
        expect(data.key.only("ctrl", "backspace") && data.input.only("8")).toBe(true);
    });
});

describe("legacy alt + character === 27 + ascii code", () => {
    // prettier-ignore
    test("alt + ctrl + letter", () => {
        expect(checkParse([27, 1], { key: ["alt", "ctrl"], input: "a"})).toBe(true);
        expect(checkParse([27, 2], { key: ["alt", "ctrl"], input: "b"})).toBe(true);
        expect(checkParse([27, 3], { key: ["alt", "ctrl"], input: "c"})).toBe(true);
    });
    test("alt + unshifted chars", () => {
        expect(checkParse([27, 97], { key: "alt", input: "a" })).toBe(true);
        expect(checkParse([27, 98], { key: "alt", input: "b" })).toBe(true);
        expect(checkParse([27, 99], { key: "alt", input: "c" })).toBe(true);
        expect(checkParse([27, 48], { key: "alt", input: "0" })).toBe(true);
    });
    test("alt + shifted chars", () => {
        expect(checkParse([27, 65], { key: "alt", input: "A" })).toBe(true);
        expect(checkParse([27, 66], { key: "alt", input: "B" })).toBe(true);
        expect(checkParse([27, 67], { key: "alt", input: "C" })).toBe(true);
        expect(checkParse([27, 41], { key: "alt", input: ")" })).toBe(true);
    });
});

describe("legacy non-modifier keys with no modifiers", () => {
    test("non-modifier keys only", () => {
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

    test("backspace is ambiguous and is not handled by hashing", () => {
        // This gets handled since \x7F === byte 127
        expect(checkParse("\x7F", { key: "backspace" })).toBe(false);
    });
});

// prettier-ignore
describe("(alt | ctrl) + key", () => {
    test("CSI 1 ; <alt> + letter", () => {
        expect(checkParse("\x1b[1;3A", { key: ["alt", "up"] })).toBe(true);
        expect(checkParse("\x1b[1;3B", { key: ["alt", "down"] })).toBe(true);
        expect(checkParse("\x1b[1;3C", { key: ["alt", "right"] })).toBe(true);
        expect(checkParse("\x1b[1;3D", { key: ["alt", "left"] })).toBe(true);
        expect(checkParse("\x1b[1;3F", { key: ["alt", "end"] })).toBe(true);
        expect(checkParse("\x1b[1;3H", { key: ["alt", "home"] })).toBe(true);
        expect(checkParse("\x1b[1;3P", { key: ["alt", "f1"] })).toBe(true);
        expect(checkParse("\x1b[1;3Q", { key: ["alt", "f2"] })).toBe(true);
        expect(checkParse("\x1b[1;3R", { key: ["alt", "f3"] })).toBe(true);
        expect(checkParse("\x1b[1;3S", { key: ["alt", "f4"] })).toBe(true);
    })

    test("CSI 1 ; <ctrl> + letter", () => {
        expect(checkParse("\x1b[1;5A", { key: ["ctrl", "up"] })).toBe(true);
        expect(checkParse("\x1b[1;5B", { key: ["ctrl", "down"] })).toBe(true);
        expect(checkParse("\x1b[1;5C", { key: ["ctrl", "right"] })).toBe(true);
        expect(checkParse("\x1b[1;5D", { key: ["ctrl", "left"] })).toBe(true);
        expect(checkParse("\x1b[1;5F", { key: ["ctrl", "end"] })).toBe(true);
        expect(checkParse("\x1b[1;5H", { key: ["ctrl", "home"] })).toBe(true);
        expect(checkParse("\x1b[1;5P", { key: ["ctrl", "f1"] })).toBe(true);
        expect(checkParse("\x1b[1;5Q", { key: ["ctrl", "f2"] })).toBe(true);
        expect(checkParse("\x1b[1;5R", { key: ["ctrl", "f3"] })).toBe(true);
        expect(checkParse("\x1b[1;5S", { key: ["ctrl", "f4"] })).toBe(true);
    })

    test("CSI 1 ; <alt + ctrl> + letter", () => {
        expect(checkParse("\x1b[1;7A", { key: ["ctrl", "alt", "up"] })).toBe(true);
        expect(checkParse("\x1b[1;7B", { key: ["ctrl", "alt", "down"] })).toBe(true);
        expect(checkParse("\x1b[1;7C", { key: ["ctrl", "alt", "right"] })).toBe(true);
        expect(checkParse("\x1b[1;7D", { key: ["ctrl", "alt", "left"] })).toBe(true);
        expect(checkParse("\x1b[1;7F", { key: ["ctrl", "alt", "end"] })).toBe(true);
        expect(checkParse("\x1b[1;7H", { key: ["ctrl", "alt", "home"] })).toBe(true);
        expect(checkParse("\x1b[1;7P", { key: ["ctrl", "alt", "f1"] })).toBe(true);
        expect(checkParse("\x1b[1;7Q", { key: ["ctrl", "alt", "f2"] })).toBe(true);
        expect(checkParse("\x1b[1;7R", { key: ["ctrl", "alt", "f3"] })).toBe(true);
        expect(checkParse("\x1b[1;7S", { key: ["ctrl", "alt", "f4"] })).toBe(true);
    })

    test("CSI number ; <alt> + ~", () => {
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

    test("CSI number ; <ctrl> + ~", () => {
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

    test("CSI number ; <ctrl + alt> + ~", () => {
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
})
