import { describe, expect, test } from "vitest";
import { keymap, type KeyMapCreator } from "../src/util/KeyMapCreator.ts";

const parse = (k: KeyMapCreator) => {
    return k._readFullKeyMap();
};

describe("KeyMapCreator", () => {
    test(".input('foo')", () => {
        const k = parse(keymap().input("foo"));
        expect(k).toEqual([{ input: "foo" }]);
    });

    test(".ctrl.input('foo')", () => {
        const k = parse(keymap().ctrl.input("foo"));
        expect(k).toEqual([{ key: ["ctrl"], input: "foo" }]);
    });

    test("combining sections", () => {
        const k = parse(keymap().ctrl.input("foo").alt.input("bar"));
        expect(k).toEqual([
            { key: ["ctrl"], input: "foo" },
            { key: ["alt"], input: "bar" },
        ]);
    });

    test("modifiers + non-alphanumeric", () => {
        const k = parse(keymap().ctrl.alt.f1());
        expect(k).toEqual([{ key: ["ctrl", "alt", "f1"] }]);
    });
});
