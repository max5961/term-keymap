import { describe, expect, test } from "vitest";
import { parseBuffer } from "../../src/parsers/parseBuffer";
import { type Data } from "../../src/types";

type Button = keyof Omit<Required<Data>["mouse"], "x" | "y">;

describe("Mouse encoded buffers", () => {
    const getData = (utf: string) => {
        return parseBuffer(Buffer.from(utf));
    };

    const onlyButton = (data: Data, ...buttons: Button[]) => {
        for (const button of buttons) {
            for (const key in data.mouse) {
                if (key === "x" || key === "y") continue;
                if (key === button && !data.mouse[key]) return false;
                if (key !== button && data.mouse[key]) return false;
            }
        }
        return true;
    };

    test("gets x and y (makes x and y zero indexed)", () => {
        const data = getData("\x1b[<35;5;10M");
        expect(data.mouse!.x).toBe(4);
        expect(data.mouse!.y).toBe(9);
    });

    test.each<[Button, number]>([
        ["leftBtnDown", 0],
        ["scrollBtnDown", 1],
        ["rightBtnDown", 2],
        ["scrollUp", 64],
        ["scrollDown", 65],
        ["mousemove", 35],
    ])("Only %s is \\x1b[<%i;10;15M", (button, code) => {
        const data = getData(`\x1b[<${code};10;15M`);
        expect(onlyButton(data, button)).toBe(true);
    });

    // Mouse moving while button press
    test.each<[Button, Button, number]>([
        ["mousemove", "leftBtnDown", 32],
        ["mousemove", "scrollBtnDown", 33],
        ["mousemove", "rightBtnDown", 34],
    ])("Only %s and %s is \\x1b[<%i;10;15M", (button, code) => {
        const data = getData(`\x1b[<${code};10;15M`);
        expect(onlyButton(data, button)).toBe(true);
    });

    test("releaseBtn (left mouse button)", () => {
        const data = getData("\x1b[0;10;15m");
        expect(onlyButton(data, "releaseBtn"));
    });
});
