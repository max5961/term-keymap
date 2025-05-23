import PeekSet from "../helpers/PeekSet.js";

// TODO: Kitty extended keyboard mode \c1b[>1u can handle some of the ambiguity
export const CtrlMap: Record<number, PeekSet<string>> = {
    0: new PeekSet([" ", "2"]),
    1: new PeekSet("a"),
    2: new PeekSet("b"),
    3: new PeekSet("c"),
    4: new PeekSet("d"),
    5: new PeekSet("e"),
    6: new PeekSet("f"),
    7: new PeekSet("g"),
    8: new PeekSet("h"),
    9: new PeekSet(["\t", "i"]),
    10: new PeekSet("j"),
    11: new PeekSet("k"),
    12: new PeekSet("l"),
    13: new PeekSet(["\r", "m"]),
    14: new PeekSet("n"),
    15: new PeekSet("o"),
    16: new PeekSet("p"),
    17: new PeekSet("q"),
    18: new PeekSet("r"),
    19: new PeekSet("s"),
    20: new PeekSet("t"),
    21: new PeekSet("u"),
    22: new PeekSet("v"),
    23: new PeekSet("w"),
    24: new PeekSet("x"),
    25: new PeekSet("y"),
    26: new PeekSet("z"),
    27: new PeekSet("3"), // Esc char
    28: new PeekSet(["\\", "4"]),
    29: new PeekSet("5"),
    30: new PeekSet(["6", "^"]),
    31: new PeekSet("7"),
    32: new PeekSet("8"), // could also be ....
    /* .... */
    // 48: new PeekSet("0"), // ctrl + 0 and 0 register as the same byte
    // 57: new PeekSet("9"), // ctrl + 9 and 9 register as the same byte also
    /* ... */
    // 33: new PeekSet("!"), // Kitty does not support this or the other ctrl + shift + numbers
    // 34: "", // empty string (need to make sure this doesn't arbitrarily trigger)
    // 35: new PeekSet("#"),
    // 36: new PeekSet("$"),
    // 37: new PeekSet("%"),
    // 38: new PeekSet("&"),
    // 39: new PeekSet("'"),
    // 40: new PeekSet("("),
    // 41: new PeekSet(")"),
    // 42: new PeekSet("*"),

    /* finish...
     * https://simple.m.wikipedia.org/wiki/File:ASCII-Table-wide.svg
     */
};
