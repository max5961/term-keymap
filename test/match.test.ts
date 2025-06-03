import { describe, expect, test } from "vitest";
import { match } from "../src/stateful/match.js";
import { PeekSet } from "../src/util/PeekSet.js";
import { KeyMap } from "../src/stateful/match.js";
import { Data } from "../src/types.js";

describe("match", () => {
    // prettier-ignore
    test.each<[boolean, KeyMap, Pick<Data, "key" | "input">]>([
        [
            true,
            { input: "a" },
            {input: new PeekSet("a"), key: new PeekSet() },
        ],

        [
            false,
            {},
            {input: new PeekSet(["a"]), key: new PeekSet()},
        ],

        [
            false,
            {},
            {input: new PeekSet(), key: new PeekSet(["ctrl"])},
        ],

        [
            false,
            {},
            {input: new PeekSet("a"), key: new PeekSet(["ctrl"])},
        ],
        
        [
            false,
            { input: "" },
            { input: new PeekSet("a"), key: new PeekSet()},

        ],

        [
            false,
            { key: [] },
            { input: new PeekSet(), key: new PeekSet(["ctrl"])},

        ],

        [
            false,
            { input: "ab" },
            { input: new PeekSet("a"), key: new PeekSet() },
        ],

        [
            true,
            { input: "a", key: "ctrl" },
            { input: new PeekSet("a"), key: new PeekSet(["ctrl"]) },
        ],

        [
            false,
            { input: "ab", key: "ctrl" },
            { input: new PeekSet("a"), key: new PeekSet(["ctrl"]) },
        ],

        [
            true,
            { input: "a", key: ["ctrl", "super"] },
            {
                input: new PeekSet("a"),
                key: new PeekSet(["ctrl", "super"]),
            },
        ],

        [
            false,
            { input: "a", key: ["ctrl"] },
            {
                input: new PeekSet("a"),
                key: new PeekSet(["ctrl", "super"]),
            }
        ],

    ])("%o %o", (result, keymap, data) => {
        expect(match(keymap, data)).toBe(result);
    });

    test("{} can never match any Data", () => {
        expect(match({}, { input: new PeekSet(), key: new PeekSet() })).toBe(
            false,
        );
    });
});
