import type { Data, KeyMap } from "../../src/types.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function print(...args: any[]): void {
    args.forEach((a) => {
        if (a && a.key && a.input && a.raw) {
            return printData(a);
        }

        if (Array.isArray(a) && a.length) {
            if (a[0].key || a[0].input) {
                return printKeymap(a);
            }
        }

        if (a !== undefined) {
            console.log(a);
        }
    });
}

function printData(d: Data): void {
    const key = [...d.key.values()];
    const input = [...d.input.values()];

    console.log("\x1b[33mData:\x1b[0m", {
        key,
        input,
        mouse: d.mouse,
        raw: d.raw,
    });
}

function printKeymap(k: KeyMap[]) {
    console.log("\x1b[33mMatched KeyMap:\x1b[0m", k);
}
