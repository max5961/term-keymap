import type { Data, Key } from "../types.js";

export type Match = {
    key?: Key | Key[];
    input?: string | string[];
};

export function match(m: Match, data: Data): boolean {
    const mKeys = Array.isArray(m.key) ? m.key : [m.key];
    const mInput = Array.isArray(m.input) ? m.input : [m.input];

    if (data.key && mKeys?.length !== data.key.size) return false;
    if (data.input && mInput?.length !== data.input.size) return false;

    for (const key of mKeys) {
        if (key && !data.key.has(key)) {
            return false;
        }
    }

    for (const inp of mInput) {
        if (inp && !data.input.has(inp)) {
            return false;
        }
    }

    return true;
}

/**
 * Handles edge cases by splitting ambiguous data into an array of possible *key* and
 * *input* combinations.  For example, `ctrl + i` sends the same keycode as `tab`,
 * so data looks like:
 * - `{ key: { 'ctrl', 'tab' }, input: { 'i' } }`.  This function
 * returns that data as:
 * - `[ {key: ['tab']}, {key: ['ctrl'], input: ['i']} ]`
 */
export function splitAmbiguousData({ key, input }: Data): Match[] {
    const toMatch = (key: Key[], input: string[]) => ({
        key: key.length ? key : undefined,
        input: input.length ? input : undefined,
    });

    const addAlt = (matches: ReturnType<typeof toMatch>[]) => {
        matches.forEach((match) => {
            if (match.key) match.key.push("alt");
        });
        return matches;
    };

    // <C-> === 'tab'
    if (key.has("ctrl", "tab") && input.only("i")) {
        const split = [toMatch(["ctrl"], ["i"]), toMatch(["tab"], [])];

        if (key.only("ctrl", "tab")) {
            return split;
        }

        if (key.only("ctrl", "tab", "alt")) {
            return addAlt(split);
        }
    }

    // <C-m> === 'return'
    if (key.has("ctrl", "return") && input.only("m")) {
        const split = [toMatch(["ctrl"], ["m"]), toMatch(["return"], [])];

        if (key.only("ctrl", "return")) {
            return split;
        }

        if (key.only("ctrl", "return", "alt")) {
            return addAlt(split);
        }
    }

    // <C-<space>> === <C-2>
    if (key.has("ctrl") && input.only(" ", "2")) {
        const split = [toMatch(["ctrl"], [" "]), toMatch(["ctrl"], ["2"])];

        if (key.only("ctrl")) {
            return split;
        }

        if (key.only("ctrl", "alt")) {
            return addAlt(split);
        }
    }

    // <C-3> === <C-[> === Esc
    if (key.has("ctrl", "esc") && input.has("3", "[")) {
        const split = [
            toMatch(["esc"], []),
            toMatch(["ctrl"], ["3"]),
            toMatch(["ctrl"], ["["]),
        ];

        if (key.only("ctrl", "esc")) {
            return split;
        }

        if (key.only("ctrl", "esc", "alt")) {
            return addAlt(split);
        }
    }

    // <C-4> === <C-\>
    if (key.has("ctrl") && input.only("\\", "4")) {
        const split = [toMatch(["ctrl"], ["\\"]), toMatch(["ctrl"], ["4"])];

        if (key.only("ctrl")) {
            return split;
        }

        if (key.only("ctrl", "alt")) {
            return addAlt(split);
        }
    }

    // <C-5> === <C-]>
    if (key.has("ctrl") && input.only("5", "]")) {
        const split = [toMatch(["ctrl"], ["5"]), toMatch(["ctrl"], ["]"])];

        if (key.only("ctrl")) {
            return split;
        }

        if (key.only("ctrl", "alt")) {
            return addAlt(split);
        }
    }

    // <C-6> === <C-^>
    if (key.has("ctrl") && input.only("^", "6")) {
        const split = [toMatch(["ctrl"], ["^"]), toMatch(["ctrl"], ["6"])];

        if (key.only("ctrl")) {
            return split;
        }

        if (key.only("ctrl", "alt")) {
            return addAlt(split);
        }
    }

    // <C-7> === <C-/>
    if (key.has("ctrl") && input.only("7", "/")) {
        const split = [toMatch(["ctrl"], ["7"]), toMatch(["ctrl"], ["/"])];

        if (key.only("ctrl")) {
            return split;
        }

        if (key.only("ctrl", "alt")) {
            return addAlt(split);
        }
    }

    // <C-8> == BS
    if (key.has("ctrl", "backspace") && input.only("8")) {
        const split = [toMatch(["ctrl"], ["8"]), toMatch(["backspace"], [])];

        if (key.only("ctrl")) {
            return split;
        }

        if (key.only("ctrl", "backspace", "alt")) {
            return addAlt(split);
        }
    }

    // <C-h> === <C-BS>
    if (key.has("ctrl", "backspace") && input.only("h")) {
        const split = [
            toMatch(["ctrl"], ["h"]),
            toMatch(["ctrl", "backspace"], []),
        ];

        if (key.only("ctrl", "backspace")) {
            return split;
        }

        if (key.only("ctrl", "backspace", "alt")) {
            return addAlt(split);
        }
    }

    return [toMatch([...key.values()], [...input.values()])];
}
