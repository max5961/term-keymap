import { describe, expect, test } from "vitest";
import { match } from "../src/stateful/match.js";
import PeekSet from "../src/helpers/PeekSet";

describe("match", () => {
    test("input: 'a'", () => {
        expect(
            match(
                { input: "a" },
                { input: new PeekSet("a"), key: new PeekSet() },
            ),
        ).toBe(true);
    });

    test("input: 'ab'", () => {
        expect(
            match(
                { input: "ab" },
                { input: new PeekSet("a"), key: new PeekSet() },
            ),
        ).toBe(false);
    });

    test("input: 'a', key: 'ctrl'", () => {
        expect(
            match(
                { input: "a", key: "ctrl" },
                { input: new PeekSet("a"), key: new PeekSet(["ctrl"]) },
            ),
        ).toBe(true);
    });

    test("input: 'a', key: ['ctrl', 'super']", () => {
        expect(
            match(
                { input: "a", key: ["ctrl", "super"] },
                {
                    input: new PeekSet("a"),
                    key: new PeekSet(["ctrl", "super"]),
                },
            ),
        ).toBe(true);
    });

    test("input: 'a', key: ['ctrl']", () => {
        expect(
            match(
                { input: "a", key: ["ctrl"] },
                {
                    input: new PeekSet("a"),
                    key: new PeekSet(["ctrl", "super"]),
                },
            ),
        ).toBe(false);
    });
});
