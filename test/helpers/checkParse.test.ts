import { describe, test, expect } from "vitest";
import { checkParse } from "./checkParse";

describe("checkParse test helper", () => {
    test("Hanldes utf", () => {
        expect(checkParse("a", { input: "a" })).toBe(true);
        expect(checkParse("a", { input: "b" })).toBe(false);
        expect(checkParse("a", { input: "a", key: "ctrl" })).toBe(false);
    });

    test("Handles num array and converts to buffer", () => {
        expect(checkParse([97], { input: "a" })).toBe(true);
        expect(checkParse([97], { input: "b" })).toBe(false);
        expect(checkParse([97], { input: "a", key: "ctrl" })).toBe(false);
        expect(checkParse([1], { input: "a", key: "ctrl" })).toBe(true);
    });
});
