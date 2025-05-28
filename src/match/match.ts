import type { Data, Key } from "../types.js";

export type Match = {
    key: Key | Key[];
    input: string | string[];
};

export function match(m: Match, data: Data): boolean {
    const mKeys = Array.isArray(m.key) ? m.key : [m.key];
    const mInput = Array.isArray(m.input) ? m.input : [m.input];

    if (mKeys.length !== data.key.size) return false;
    if (mInput.length !== data.input.size) return false;

    for (const key of mKeys) {
        if (!data.key.has(key)) {
            return false;
        }
    }

    for (const inp of mInput) {
        if (!data.input.has(inp)) {
            return false;
        }
    }

    return true;
}
