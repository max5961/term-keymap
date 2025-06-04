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

    test("only the final escape code in a concatenation is relevant", () => {
        const d1 = parseBuffer(
            Buffer.from("\x1B[57743;5u\x1b[57444;7u\x1B[1;15F"),
        );
        const d2 = parseBuffer(Buffer.from("\x1B[1;15F"));

        const noraw1 = { key: d1.key, input: d1.input };
        const noraw2 = { key: d2.key, input: d2.input };

        expect(noraw1).toEqual(noraw2);
    });

    test("if an esc code is unhandled it does not modify input or key", () => {
        const data = parseBuffer(Buffer.from("\x1binvalid"));

        expect({ keysize: data.key.size, inputsize: data.input.size }).toEqual({
            keysize: 0,
            inputsize: 0,
        });
    });

    test("can paste an escaped escape code", () => {
        const data = parseBuffer(Buffer.from("\\x1binvalid"));

        expect(data.key.size).toBe(0);
        expect(data.input.only("\\x1binvalid")).toBe(true);
    });
});
