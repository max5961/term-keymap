import { describe, expect, test } from "vitest";
import { key, type KeyMapCreator } from "../src/util/KeyMapCreator.ts";

const parse = (k: KeyMapCreator) => {
    return k.$$read();
};

describe("KeyMapCreator", () => {
    test(".input('foo')", () => {
        const k = parse(key.input("foo"));
        expect(k).toEqual([{ input: "foo" }]);
    });

    test(".ctrl.input('foo')", () => {
        const k = parse(key.ctrl.input("foo"));
        expect(k).toEqual([{ key: ["ctrl"], input: "foo" }]);
    });

    test("combining sections", () => {
        const k = parse(key.ctrl.input("foo").alt.input("bar"));
        expect(k).toEqual([
            { key: ["ctrl"], input: "foo" },
            { key: ["alt"], input: "bar" },
        ]);
    });

    test("modifiers + non-alphanumeric", () => {
        const k = parse(key.ctrl.alt.f1);
        expect(k).toEqual([{ key: ["ctrl", "alt", "f1"] }]);
    });

    test("non modifier keys always creates new section", () => {
        const k = parse(key.f1.f2.f3.input("foo"));
        expect(k).toEqual([
            { key: ["f1"] },
            { key: ["f2"] },
            { key: ["f3"] },
            { input: "foo" },
        ]);
    });
});
