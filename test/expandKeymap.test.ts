import { describe, test, expect } from "vitest";
import { expandKeymap } from "../src/stateful/expandKeymap.js";
import { KeyMap } from "../src/stateful/match.js";

describe("expandKeymap", () => {
    test.each<[string, KeyMap | KeyMap[], KeyMap[]]>([
        ["Empty KeyMap", {}, [{}]],

        ["Empty KeyMap[]", [], []],

        [
            "Nothing to expand, but array-ifies object",
            { key: "ctrl", input: "a" },
            [{ key: "ctrl", input: "a" }],
        ],

        [
            "Handles variable amount of keys",
            { key: ["ctrl", "alt", "meta"], input: "a" },
            [{ key: ["ctrl", "alt", "meta"], input: "a" }],
        ],

        [
            "Accepts arguments already in expanded form",
            [{ input: "f" }, { input: "o" }, { input: "o" }],
            [{ input: "f" }, { input: "o" }, { input: "o" }],
        ],

        [
            "Input length > 1 forces expansion",
            { input: "foo" },
            [{ input: "f" }, { input: "o" }, { input: "o" }],
        ],

        [
            "Input length > 1 w/ keys forces expansion",
            { key: "ctrl", input: "foo" },
            [
                { key: "ctrl", input: "f" },
                { key: "ctrl", input: "o" },
                { key: "ctrl", input: "o" },
            ],
        ],

        [
            "Expands with variable amount of keys",
            { key: ["ctrl", "alt", "super"], input: "foo" },
            [
                { key: ["ctrl", "alt", "super"], input: "f" },
                { key: ["ctrl", "alt", "super"], input: "o" },
                { key: ["ctrl", "alt", "super"], input: "o" },
            ],
        ],

        [
            "KeyMap[] where each child needs expanding",
            [
                { key: "ctrl", input: "foo" },
                { key: "alt", input: "BAR" },
            ],
            [
                { key: "ctrl", input: "f" },
                { key: "ctrl", input: "o" },
                { key: "ctrl", input: "o" },
                { key: "alt", input: "B" },
                { key: "alt", input: "A" },
                { key: "alt", input: "R" },
            ],
        ],

        [
            "Fully expanded already",
            [
                { key: ["ctrl", "alt"] },
                { key: "super" },
                { key: ["ctrl"], input: "f" },
                { input: "o" },
                { input: "o" },
            ],
            [
                { key: ["ctrl", "alt"] },
                { key: "super" },
                { key: ["ctrl"], input: "f" },
                { input: "o" },
                { input: "o" },
            ],
        ],
    ])("%s ' %o '", (_, compacted, expanded) => {
        expect(expandKeymap(compacted)).toEqual(expanded);
    });
});
