import { describe, test, expect } from "vitest";
import { InputLine } from "../../src/stateful/InputLine";
import { createKeymap } from "../../src/stateful/createKeymap";

describe("inputLine", () => {
    test("debug", () => {
        const keymaps = [
            createKeymap({
                name: "foo",
                keymap: { input: "abc" },
            }),
        ];

        const ip = new InputLine(50);

        const results = [] as (undefined | string)[];

        let res = ip.process(Buffer.from("\x1b[97u"), keymaps);
        results.push(res.name);

        res = ip.process(Buffer.from("\x1b[98u"), keymaps);
        results.push(res.name);

        res = ip.process(Buffer.from("\x1b[99u"), keymaps);
        results.push(res.name);

        expect(results).toEqual([undefined, undefined, "foo"]);
    });
});
