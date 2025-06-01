import { describe, test, expect } from "vitest";
import { Decode } from "../src/helpers/Decode.js";

describe("Detects kitty CSI sequences", () => {
    test("kitty: CSI number u", () => {
        expect(Decode.getEncoding("\x1b[97u")).toBe("kitty");
        expect(Decode.getEncoding("\x1b[57442u")).toBe("kitty");
    });

    test("kitty: CSI number ; modifier u", () => {
        expect(Decode.getEncoding("\x1b[97;5u")).toBe("kitty");
        expect(Decode.getEncoding("\x1b[97;133u")).toBe("kitty");
    });
});

describe("Detects legacy CSI sequences", () => {
    const letters = Object.keys(Decode.LetterMap);

    test("legacy: ss3 (\\x1b + O)", () => {
        expect(Decode.getEncoding("\x1bOP")).toBe("legacy");
        expect(Decode.getEncoding("\x1bOQ")).toBe("legacy");
        expect(Decode.getEncoding("\x1bOR")).toBe("legacy");
        expect(Decode.getEncoding("\x1bOS")).toBe("legacy");
    });

    test("legacy: num + ~", () => {
        expect(Decode.getEncoding("\x1b[15~")).toBe("legacy");
        expect(Decode.getEncoding("\x1b[17~")).toBe("legacy");
    });

    test("legacy: letter only", () => {
        for (const letter of letters) {
            expect(Decode.getEncoding(`\x1b[${letter}`)).toBe("legacy");
        }
    });

    test("legacy: with modifier", () => {
        for (const letter of letters) {
            expect(Decode.getEncoding(`\x1b[1;5${letter}`)).toBe("legacy");
        }
        expect(Decode.getEncoding("\x1b[1;5A")).toBe("legacy");
        expect(Decode.getEncoding("\x1b[6;5~")).toBe("legacy");
        expect(Decode.getEncoding("\x1b[18;129~")).toBe("legacy");
    });
});

describe("Detects mouse CSI sequences", () => {
    test("Single", () => {
        expect(Decode.getEncoding("\x1b[<35;3;17M")).toBe("mouse");
        expect(Decode.getEncoding("\x1b[<35;3;17m")).toBe("mouse");
        expect(Decode.getEncoding("\x1b[<1;25;25M")).toBe("mouse");
        expect(Decode.getEncoding("\x1b[<12345;12345;12345m")).toBe("mouse");
    });

    test("concat sequences", () => {
        // prettier-ignore
        expect(Decode.getEncoding("\x1b[<35;3;17M\x1b[<35;3;17M")).toBe("mouse");
    });

    test("incorrect letter", () => {
        expect(Decode.getEncoding("\x1b[<123;123;123A]")).toBe("xterm");
    });
});

describe("Falls through CSI/SS3 checks and defaults to xterm", () => {
    test("chars", () => {
        expect(Decode.getEncoding("a")).toBe("xterm");
        expect(Decode.getEncoding("b")).toBe("xterm");
        expect(Decode.getEncoding("c")).toBe("xterm");
        expect(Decode.getEncoding("A")).toBe("xterm");
        expect(Decode.getEncoding("B")).toBe("xterm");
        expect(Decode.getEncoding("C")).toBe("xterm");
        expect(Decode.getEncoding("1")).toBe("xterm");
        expect(Decode.getEncoding("2")).toBe("xterm");
        expect(Decode.getEncoding("3")).toBe("xterm");
        expect(Decode.getEncoding("!")).toBe("xterm");
        expect(Decode.getEncoding("@")).toBe("xterm");
        expect(Decode.getEncoding("#")).toBe("xterm");
    });

    test("strings", () => {
        expect(Decode.getEncoding("foo")).toBe("xterm");
    });

    // prettier-ignore
    test("ctrl characters", ()=> {
        expect(Decode.getEncoding(Buffer.from([0]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([1]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([2]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([3]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([4]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([5]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([6]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([7]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([8]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([9]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([10]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([11]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([12]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([13]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([14]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([15]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([16]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([17]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([18]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([19]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([20]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([21]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([22]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([23]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([24]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([25]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([26]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([27]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([28]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([29]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([30]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([31]).toString("utf-8"))).toBe("xterm");
        expect(Decode.getEncoding(Buffer.from([32]).toString("utf-8"))).toBe("xterm");
    })
});

describe("Regex captures kitty correctly", () => {
    // prettier-ignore
    test("CSI + code ; modifier u", () => {
        expect(Decode.getKittyCaptures("\x1b[107;5u")).toEqual([107, 5]);
        expect(Decode.getKittyCaptures("\x1b[97;65u")).toEqual([97, 65]);
        expect(Decode.getKittyCaptures("\x1b[98;133u")).toEqual([98, 133]);
        expect(Decode.getKittyCaptures("\x1b[12345;56789u")).toEqual([12345, 56789]);
    });

    test("CSI + code u", () => {
        expect(Decode.getKittyCaptures("\x1b[97u")).toEqual([97]);
        expect(Decode.getKittyCaptures("\x1b[105u")).toEqual([105]);
    });

    test("Invalid kitty codes === empty array", () => {
        expect(Decode.getKittyCaptures("\x1b[105")).toEqual([]);
    });
});
