import { describe, test, expect } from "vitest";
import { Decode } from "../src/util/Decode.js";
import { testEachCsi } from "./helpers/testEachCsi.js";

type TestCases = [string, ...unknown[]][];

const testHelper = (testCases: TestCases) => {
    testEachCsi({
        tests: testCases,
        title: (csi, encoding) => `${csi} should be ${encoding}`,
        cb: (csi, encoding) => {
            expect(Decode.getEncoding(csi)).toBe(encoding);
        },
    });
};

describe("Decode kitty CSI sequences", () => {
    describe("CSI keycode u", () => {
        testHelper([
            ["\x1b[97u", "kitty"],
            ["\x1b[57442u", "kitty"],
        ]);
    });

    describe("CSI keycode ; modifier u", () => {
        testHelper([
            ["\x1b[97;5u", "kitty"],
            ["\x1b[97;133u", "kitty"],
        ]);
    });
});

describe("Decode legacy CSI sequences", () => {
    describe("ss3 (\\x1b + O)", () => {
        testHelper([
            ["\x1bOP", "legacy"],
            ["\x1bOQ", "legacy"],
            ["\x1bOR", "legacy"],
            ["\x1bOS", "legacy"],
        ]);
    });

    describe("CSI num ~", () => {
        testHelper([
            ["\x1b[6~", "legacy"],
            ["\x1b[15~", "legacy"],
        ]);
    });

    describe("CSI {ABCDHF}", () => {
        testHelper([
            ["\x1b[A", "legacy"],
            ["\x1b[B", "legacy"],
            ["\x1b[C", "legacy"],
            ["\x1b[D", "legacy"],
            ["\x1b[H", "legacy"],
            ["\x1b[F", "legacy"],
        ]);
    });

    describe("CSI (1 | number) ; modifier {ABCDHFPQRS~}", () => {
        testHelper([
            ["\x1b[1;5A", "legacy"],
            ["\x1b[1;5B", "legacy"],
            ["\x1b[1;5C", "legacy"],
            ["\x1b[1;5D", "legacy"],
            ["\x1b[1;5H", "legacy"],
            ["\x1b[1;5F", "legacy"],
            ["\x1b[5;5~", "legacy"],
            ["\x1b[18;129~", "legacy"],
        ]);
    });
});

describe("Decode mouse CSI sequences", () => {
    testHelper([
        ["\x1b[<0;0;0M", "mouse"],
        ["\x1b[<2;0;0m", "mouse"],
        ["\x1b[<35;5;5M", "mouse"],
        ["\x1b[<35;15;15M", "mouse"],
        ["\x1b[<35;15;15m", "mouse"],
        ["\x1b[<35;12345;12345M", "mouse"],
        ["\x1b[<35;12345;12345m", "mouse"],
    ]);

    test("concat sequences", () => {
        // prettier-ignore
        expect(Decode.getEncoding("\x1b[<35;3;17M\x1b[<35;3;17M")).toBe("mouse");
    });

    test("incorrect letter", () => {
        expect(Decode.getEncoding("\x1b[<123;123;123A]")).toBe("xterm");
    });
});

describe("Decode.getEncoding defaults to xterm", () => {
    test.each([
        ["a", "xterm"],
        ["b", "xterm"],
        ["c", "xterm"],
        ["A", "xterm"],
        ["B", "xterm"],
        ["C", "xterm"],
        ["1", "xterm"],
        ["2", "xterm"],
        ["3", "xterm"],
        ["!", "xterm"],
        ["@", "xterm"],
        ["#", "xterm"],
        ["foo", "xterm"],
    ])("Characters and strings: %s should be %s", (utf, encoding) => {
        expect(Decode.getEncoding(utf)).toBe(encoding);
    });

    [
        [0, "xterm"],
        [1, "xterm"],
        [2, "xterm"],
        [3, "xterm"],
        [4, "xterm"],
        [5, "xterm"],
        [6, "xterm"],
        [7, "xterm"],
        [8, "xterm"],
        [9, "xterm"],
        [10, "xterm"],
        [11, "xterm"],
        [12, "xterm"],
        [13, "xterm"],
        [14, "xterm"],
        [15, "xterm"],
        [16, "xterm"],
        [17, "xterm"],
        [18, "xterm"],
        [19, "xterm"],
        [20, "xterm"],
        [21, "xterm"],
        [22, "xterm"],
        [23, "xterm"],
        [24, "xterm"],
        [25, "xterm"],
        [26, "xterm"],
        [27, "xterm"],
        [28, "xterm"],
        [29, "xterm"],
        [30, "xterm"],
        [31, "xterm"],
        [32, "xterm"],
    ].forEach(([num, encoding]) => {
        test(`Control characters - [${num}] is ${encoding}`, () => {
            expect(
                Decode.getEncoding(Buffer.from([num as number]).toString()),
            ).toBe(encoding);
        });
    });
});

const captureTestHelper = (
    testCases: TestCases,
    method: (csi: string) => unknown[],
) => {
    testEachCsi({
        tests: testCases,
        title: (csi, expected) =>
            `${csi} should equal [${expected.toString()}]`,
        cb: (csi, expected) => {
            expect(method(csi)).toEqual(expected);
        },
    });
};

describe("Invalid sequences that don't capture anything return empty arrays", () => {
    const invalid = "\x1b";
    test("Invalid kitty", () => {
        expect(Decode.getKittyCaptures(invalid)).toEqual([]);
    });
    test("Invalid legacy", () => {
        expect(Decode.getLegacyCaptures(invalid)).toEqual([]);
    });
    test("Invalid mouse", () => {
        expect(Decode.getMouseCaptures(invalid)).toEqual([]);
    });
});

describe("Regex captures kitty correctly", () => {
    describe("CSI code ; modifier u", () => {
        captureTestHelper(
            [
                ["\x1b[97;5u", [97, 5]],
                ["\x1b[97;65u", [97, 65]],
                ["\x1b[123;456u", [123, 456]],
                ["\x1b[0;5u", [0, 5]],
            ],
            Decode.getKittyCaptures,
        );
    });

    describe("CSI code u", () => {
        captureTestHelper(
            [
                ["\x1b[0u", [0]],
                ["\x1b[97u", [97]],
                ["\x1b[105u", [105]],
            ],
            Decode.getKittyCaptures,
        );
    });
});

describe("Regex captures legacy keys correctly", () => {
    describe("CSI {ABCDHF}", () => {
        captureTestHelper(
            [
                ["\x1b[A", ["A"]],
                ["\x1b[B", ["B"]],
                ["\x1b[C", ["C"]],
                ["\x1b[D", ["D"]],
                ["\x1b[H", ["H"]],
                ["\x1b[F", ["F"]],
            ],
            Decode.getLegacyCaptures,
        );
    });

    describe("SS3 letter", () => {
        captureTestHelper(
            [
                ["\x1bOP", ["O", "P"]],
                ["\x1bOQ", ["O", "Q"]],
                ["\x1bOR", ["O", "R"]],
                ["\x1bOS", ["O", "S"]],
            ],
            Decode.getLegacyCaptures,
        );
    });

    describe("CSI number ~", () => {
        captureTestHelper(
            [
                ["\x1b[2~", [2, "~"]],
                ["\x1b[3~", [3, "~"]],
                ["\x1b[6~", [6, "~"]],
                ["\x1b[15~", [15, "~"]],
            ],
            Decode.getLegacyCaptures,
        );
    });

    describe("CSI number ; modifier ~", () => {
        captureTestHelper(
            [
                ["\x1b[2;5~", [2, 5, "~"]],
                ["\x1b[3;5~", [3, 5, "~"]],
                ["\x1b[6;65~", [6, 65, "~"]],
                ["\x1b[15;133~", [15, 133, "~"]],
            ],
            Decode.getLegacyCaptures,
        );
    });
});

// prettier-ignore
describe("Regex captures mouse correctly", () => {
    captureTestHelper([
        ["\x1b[<0;0;0M", [0, 0, 0, "M"]],
        ["\x1b[<1;2;3M", [1, 2, 3, "M"]],
        ["\x1b[<35;10;15M", [35, 10, 15, "M"]],
        ["\x1b[<111;222;333M", [111, 222, 333, "M"]],
        ["\x1b[<0;0;0m", [0, 0, 0, "m"]],
        ["\x1b[<1;2;3m", [1, 2, 3, "m"]],
        ["\x1b[<35;10;15m", [35, 10, 15, "m"]],
        ["\x1b[<111;222;333m", [111, 222, 333, "m"]],
    ], Decode.getMouseCaptures);
});
