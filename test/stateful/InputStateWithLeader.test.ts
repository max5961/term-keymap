import { describe, test, expect } from "vitest";
import { createActionsWithLeader } from "../../src/stateful/createActions";
import { InputState } from "../../src/stateful/InputState";

describe.only("Keymaps with leader", () => {
    test("leader as ' '", () => {
        const actions = createActionsWithLeader({ input: " " })([
            {
                keymap: { leader: true, input: "foo" },
                name: "leader-foo",
                callback() {
                    console.log(this.name);
                },
            },
            {
                keymap: { input: "bar" },
                name: "bar",
                callback() {
                    console.log(this.name);
                },
            },
        ]);

        const ip = new InputState();

        const results = [] as (undefined | string)[];

        let r = ip.process(Buffer.from(" "), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("f"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        r = ip.process(Buffer.from("o"), actions);
        results.push(r.name);

        expect(results).toEqual([
            undefined,
            undefined,
            undefined,
            "leader-foo",
        ]);
    });
});
