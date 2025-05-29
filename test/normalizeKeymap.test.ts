import { describe, test, expect } from "vitest";
import { normalizeKeymap } from "../src/match/normalizeKeymap.js";
import { KeyMap } from "../src/match/match.js";

describe("normalizeKeymap", () => {
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
        expect(normalizeKeymap(seq1)).toEqual([seq1]);
    });

    test(JSON.stringify(seq2), () => {
        expect(normalizeKeymap(seq2)).toEqual([
            { key: ["ctrl", "alt", "meta"], input: "a" },
            { key: ["ctrl", "alt", "meta"], input: "b" },
            { key: ["ctrl", "alt", "meta"], input: "c" },
        ]);
    });

    test(JSON.stringify(seq3), () => {
        expect(normalizeKeymap(seq3)).toEqual([
            { input: "a" },
            { input: "b" },
            { input: "c" },
        ]);
    });

    test(JSON.stringify(seq4), () => {
        expect(normalizeKeymap(seq4)).toEqual([
            { key: "ctrl", input: "a" },
            { key: "ctrl", input: "a" },
            { key: "ctrl", input: "a" },
            { key: "alt", input: "b" },
            { key: "alt", input: "b" },
            { key: "alt", input: "b" },
        ]);
    });

    test(JSON.stringify(seq5), () => {
        expect(normalizeKeymap(seq5)).toEqual([
            { key: "ctrl" },
            { key: "meta" },
            { key: "alt" },
            { input: "a" },
            { input: "b" },
            { input: "c" },
        ]);
    });

    test(JSON.stringify(seq6), () => {
        expect(normalizeKeymap(seq6)).toEqual([{}]);
    });

    test(JSON.stringify(seq7), () => {
        expect(normalizeKeymap(seq7)).toEqual([]);
    });
});
