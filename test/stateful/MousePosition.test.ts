import { describe, expect, test } from "vitest";
import { MousePosition, TestEnv } from "../../src/stateful/MousePosition";
import { Data, MouseState } from "../../src";

TestEnv.current = true;

describe("MousePosition.resolve", () => {
    const getStdout = (rows: number) => {
        return { rows } as NodeJS.WriteStream & { fd: 1 };
    };

    const fakeData = (x: number, y: number) => {
        return {
            raw: { utf: `\x1b[${y + 1};${x + 1}R` },
        } as Data;
    };

    test("resolves empty events", async () => {
        const state = new MouseState();

        // events array is empty because 'a' stdin is not a mouse buffer
        const { resolveMousePosition } = state.process(Buffer.from("a"));
        const resolvedEvents = await resolveMousePosition(10, getStdout(30));

        expect(resolvedEvents).toEqual([]);
    });

    // Why the **** is MousePosition.resolve not simply a function that is returned
    // from MouseState.process.  Doing so would mean that we could limit the
    // arguments to simply height and stdout...

    test("resolve mouse position", async () => {
        //  0 >
        //  1 >
        //  2 >
        //  3 >╭──────────────╮
        //  4 >│              │
        //  5 >│              │
        //  6 >│  real: 2,8   │
        //  7 >│  vir: 2,5    │
        //  8 >│ X            │
        //  9 >│              │
        // 10 >█──────────────╯
        // 11 >
        // 12 >
        // 13 >
        // 14 >

        // we use 0 based indexing, but VT100 uses 1 based
        const realX = 3;
        const realY = 9;
        const virX = 2;
        const virY = 5;
        const layoutHeight = 8;
        const stdout = getStdout(15);
        const resultdata = fakeData(0, 10);

        const state = new MouseState();
        const { resolveMousePosition } = state.process(
            Buffer.from(`\x1b[<0;${realX};${realY}M`),
        );

        const pending = resolveMousePosition(layoutHeight, stdout);
        state.process(resultdata);
        const results = await pending;

        const mapped = results?.map((e) => {
            return { x: e.clientX, y: e.clientY };
        });

        expect(
            mapped && mapped.every((e) => e.x === virX && e.y === virY),
        ).toBe(true);
    });
});
