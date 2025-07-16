import { describe, test, expect } from "vitest";
import { checkParse } from "../checkParse";
import type { KeyMap } from "../../../src/types";

describe("checkParse test helper", () => {
    test.each<[boolean, string, KeyMap]>([
        [true, "a", { input: "a" }],
        [false, "a", { input: "b" }],
        [false, "a", { input: "a", key: "ctrl" }],
    ])("Handles utf argument %s", (result, utf, keymap) => {
        expect(checkParse(utf, keymap)).toBe(result);
    });

    test.each<[boolean, number[], KeyMap]>([
        [true, [97], { input: "a" }],
        [false, [97], { input: "b" }],
        [true, [27, 97], { input: "a", key: "alt" }],
        [false, [27, 97], { input: "a", key: "ctrl" }],
        [true, [1], { input: "a", key: "ctrl" }],
    ])("Handles num array argument $o", (result, buf, keymap) => {
        expect(checkParse(buf, keymap)).toBe(result);
    });
});
