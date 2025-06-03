import { describe, test, expect } from "vitest";
import { shallowMatch } from "./shallowMatch";
import { PeekSet } from "../../src/util/PeekSet";
import { KeyMap } from "../../src/stateful/match";
import { ShortData } from "./shallowMatch";

describe("shallowMatch test helper", () => {
    test.each<[boolean, KeyMap, ShortData]>([
        [
            true,
            { key: "ctrl", input: "a" },
            { key: new PeekSet(["ctrl"]), input: new PeekSet(["a"]) },
        ],

        [
            true,
            { key: ["ctrl", "alt"], input: "aa" },
            {
                key: new PeekSet(["ctrl", "alt"]),
                input: new PeekSet(["aa"]),
            },
        ],

        [
            false,
            { key: "ctrl", input: "a" },
            { key: new PeekSet(["ctrl"]), input: new PeekSet(["b"]) },
        ],

        [
            false,
            { key: ["ctrl", "alt"], input: "a" },
            {
                key: new PeekSet(["ctrl", "alt"]),
                input: new PeekSet(["b"]),
            },
        ],
    ])("%o %o", (result, keymap, shortdata) => {
        expect(shallowMatch(keymap, shortdata)).toBe(result);
    });
});
