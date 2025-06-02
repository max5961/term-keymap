import { describe, test, expect } from "vitest";
import { shallowMatch } from "./shallowMatch";
import { PeekSet } from "../../src/util/PeekSet";

describe("shallowMatch test helper", () => {
    test("true", () => {
        expect(
            shallowMatch(
                { key: "ctrl", input: "a" },
                { key: new PeekSet(["ctrl"]), input: new PeekSet(["a"]) },
            ),
        ).toBe(true);
        expect(
            shallowMatch(
                { key: ["ctrl", "alt"], input: "aa" },
                {
                    key: new PeekSet(["ctrl", "alt"]),
                    input: new PeekSet(["aa"]),
                },
            ),
        ).toBe(true);
    });
    test("false", () => {
        expect(
            shallowMatch(
                { key: "ctrl", input: "a" },
                { key: new PeekSet(["ctrl"]), input: new PeekSet(["b"]) },
            ),
        ).toBe(false);
        expect(
            shallowMatch(
                { key: ["ctrl", "alt"], input: "a" },
                {
                    key: new PeekSet(["ctrl", "alt"]),
                    input: new PeekSet(["b"]),
                },
            ),
        ).toBe(false);
    });
});
