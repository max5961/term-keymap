import { describe, test, expect } from "vitest";
import { expandKeymap } from "../src/match/expandKeymap.js";
import { KeyMap } from "../src/match/match.js";

describe("expandKeymap", () => {
    const seq1: KeyMap = { key: ["ctrl", "alt", "meta"], input: "a" };
    const seq2: KeyMap = { key: ["ctrl", "alt", "meta"], input: "abc" };
    const seq3: KeyMap[] = [{ input: "a" }, { input: "b" }, { input: "c" }];
    const seq4: KeyMap[] = [
        { key: "ctrl", input: "aaa" },
        { key: "alt", input: "bbb" },
    ];
    const seq5: KeyMap[] = [
        { key: "ctrl" },
        { key: "meta" },
        { key: "alt" },
        { input: "a" },
        { input: "b" },
        { input: "c" },
    ];

    const seq6: KeyMap = {};
    const seq7: KeyMap[] = [];

    test(JSON.stringify(seq1), () => {
        expect(expandKeymap(seq1)).toEqual([seq1]);
    });

    test(JSON.stringify(seq2), () => {
        expect(expandKeymap(seq2)).toEqual([
            { key: ["ctrl", "alt", "meta"], input: "a" },
            { key: ["ctrl", "alt", "meta"], input: "b" },
            { key: ["ctrl", "alt", "meta"], input: "c" },
        ]);
    });

    test(JSON.stringify(seq3), () => {
        expect(expandKeymap(seq3)).toEqual([
            { input: "a" },
            { input: "b" },
            { input: "c" },
        ]);
    });

    test(JSON.stringify(seq4), () => {
        expect(expandKeymap(seq4)).toEqual([
            { key: "ctrl", input: "a" },
            { key: "ctrl", input: "a" },
            { key: "ctrl", input: "a" },
            { key: "alt", input: "b" },
            { key: "alt", input: "b" },
            { key: "alt", input: "b" },
        ]);
    });

    test(JSON.stringify(seq5), () => {
        expect(expandKeymap(seq5)).toEqual([
            { key: "ctrl" },
            { key: "meta" },
            { key: "alt" },
            { input: "a" },
            { input: "b" },
            { input: "c" },
        ]);
    });

    test(JSON.stringify(seq6), () => {
        expect(expandKeymap(seq6)).toEqual([{}]);
    });

    test(JSON.stringify(seq7), () => {
        expect(expandKeymap(seq7)).toEqual([]);
    });
});
