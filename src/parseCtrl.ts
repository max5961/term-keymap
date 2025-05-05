import type { Data } from "./Data.js";

// TODO: Kitty extended keyboard mode \c1b[>1u can handle some of the ambiguity
const CtrlMap: Record<number, string> = {
    0: " ", // could also be "2",
    1: "a",
    2: "b",
    3: "c",
    4: "d",
    5: "e",
    6: "f",
    7: "g",
    8: "h",
    9: "i", // also /t
    10: "j",
    11: "k",
    12: "l",
    13: "m", // also /r
    14: "n",
    15: "o",
    16: "p",
    17: "q",
    18: "r",
    19: "s",
    20: "t",
    21: "u",
    22: "v",
    23: "w",
    24: "x",
    25: "y",
    26: "z",
    27: "3",
    28: "4", // could also be "\"
    29: "5",
    30: "6", // could also be '^'
    31: "7",
    32: "8", // could also be ....
    /* .... */
    48: "0",
    57: "9",
    /* ... */
    33: "!", // Kitty does not support this or the other ctrl + shift + numbers
    // 34: "", // empty string (need to make sure this doesn't arbitrarily trigger)
    35: "#",
    36: "$",
    37: "%",
    38: "&",
    39: "'",
    40: "(",
    41: ")",
    42: "*",

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
