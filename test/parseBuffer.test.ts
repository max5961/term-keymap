import { describe, test, expect } from "vitest";
import { parseBuffer } from "../src/parse/parseBuffer";

describe("buffers that aren't explicitly handled are encoded to utf and added to the input set", () => {
    test("pasted text", () => {
        const data = parseBuffer(Buffer.from("foobar", "utf-8"));
        expect(!data.key.size && data.input.only("foobar")).toBe(true);
    });

    test("unicode", () => {
        const unicodes = ["‼", "⁇", "Ξ", "↷", "⇒"];

        for (let i = 0; i < unicodes.length; ++i) {
            const data = parseBuffer(Buffer.from(unicodes[i], "utf-8"));
            expect(!data.key.size && data.input.only(unicodes[i])).toBe(true);
        }
    });
});

describe("edge cases", () => {
    test("empty buffer", () => {
        const data = parseBuffer(Buffer.from([]));
        expect(data.key.size).toBe(0);
        expect(data.input.size).toBe(0);
    });

    // This is the case such as when you press and hold a key.  Every now and then
    // key data may be concatenated.  Could handle differently if dropping the occasional
    // key is noticable and looks bad.
    //
    // TODO: Actually just modify the regex so that it only reads the final \x1b sequence,
    // that way nothing actually falls through
    test.todo(
        "Concatenated esc codes fall through and do not modify data",
        () => {
            const data = parseBuffer(Buffer.from("\x1b[A\x1b[A"));
            expect(data.key.size).toBe(0);
            expect(data.input.size).toBe(0);
        },
    );
});
