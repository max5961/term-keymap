import { describe, test, expect } from "vitest";
import type { Key } from "../../../src/types.js";
import { encodeMods } from "../encodeMods.js";

describe("encodeMods converts set of keys into a byte", () => {
    test.each<[Key[], number]>([
        [[], 1],
        [["shift"], 2],
        [["alt"], 3],
        [["ctrl"], 5],
        [["super"], 9],
        [["capsLock"], 65],
        [["numLock"], 129],

        [["alt", "shift"], 4],
        [["ctrl", "shift"], 6],
        [["ctrl", "alt"], 7],
        [["ctrl", "alt", "shift"], 8],
        [["ctrl", "alt", "shift"], 8],
        [["ctrl", "alt", "shift", "super"], 16],
        [["ctrl", "alt", "shift", "super", "capsLock", "numLock"], 208],
    ])("%o => %i", (keys, num) => {
        expect(encodeMods(keys)).toBe(num);
    });
});
