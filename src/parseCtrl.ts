import type { Data } from "./Data.js";

// TODO: Kitty extended keyboard mode \c1b[>1u can handle some of the ambiguity
const CtrlMap: Record<number, Set<string>> = {
    0: new Set([" ", "2"]), // could also be "2",
    1: new Set("a"),
    2: new Set("b"),
    3: new Set("c"),
    4: new Set("d"),
    5: new Set("e"),
    6: new Set("f"),
    7: new Set("g"),
    8: new Set("h"),
    9: new Set(["\t", "i"]),
    10: new Set("j"),
    11: new Set("k"),
    12: new Set("l"),
    13: new Set(["\r", "m"]),
    14: new Set("n"),
    15: new Set("o"),
    16: new Set("p"),
    17: new Set("q"),
    18: new Set("r"),
    19: new Set("s"),
    20: new Set("t"),
    21: new Set("u"),
    22: new Set("v"),
    23: new Set("w"),
    24: new Set("x"),
    25: new Set("y"),
    26: new Set("z"),
    27: new Set("3"),
    28: new Set(["\\", "4"]),
    29: new Set("5"),
    30: new Set(["6", "^"]),
    31: new Set("7"),
    32: new Set("8"), // could also be ....
    /* .... */
    // 48: new Set("0"), // ctrl + 0 and 0 register as the same byte
    // 57: new Set("9"), // ctrl + 9 and 9 register as the same byte also
    /* ... */
    // 33: new Set("!"), // Kitty does not support this or the other ctrl + shift + numbers
    // 34: "", // empty string (need to make sure this doesn't arbitrarily trigger)
    // 35: new Set("#"),
    // 36: new Set("$"),
    // 37: new Set("%"),
    // 38: new Set("&"),
    // 39: new Set("'"),
    // 40: new Set("("),
    // 41: new Set(")"),
    // 42: new Set("*"),

    /* finish...
     * https://simple.m.wikipedia.org/wiki/File:ASCII-Table-wide.svg
     */
};

export function parseCtrlChar(buf: Buffer, data: Data): void {
    const num = buf[0];

    // Return if out of range or escape character
    if (num > 127 || num === 27) return;

    if (num in CtrlMap) {
        data.key.ctrl = true;
        data.input = CtrlMap[num];
    }

    // Ambiguous mappings update both input and the key
    if (num === 9) data.key.tab = true;
    if (num === 13) data.key.return = true;
}
