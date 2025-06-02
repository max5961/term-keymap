import { PeekSet } from "../util/PeekSet.js";

/**
 * Matches control codes to their character combinations.
 *
 * `ctrl` + `-|=|-|1|3|9|'|;|,|.` don't emit distinct control codes so they
 * aren't included.  These are commented out and marked with a `!`.
 *
 * Ambiguous `Ctrl` + `char|key` combinations are:
 * - `<C-h>` = `<C-backspace>`
 * - `<C-i>` = `tab`
 * - `<C-m>` = `return`
 * - `<C-3>` = `esc` = `<C-[>`
 * - `<C-8>` = `backspace`
 */
export const CtrlMap: Record<number, PeekSet<string>> = {
    0: new PeekSet([" ", "2"]),
    1: new PeekSet("a"),
    2: new PeekSet("b"),
    3: new PeekSet("c"),
    4: new PeekSet("d"),
    5: new PeekSet("e"),
    6: new PeekSet("f"),
    7: new PeekSet("g"),
    8: new PeekSet("h"), // can also be ctrl + backspace
    9: new PeekSet("i"), // can also be 'tab'
    10: new PeekSet("j"),
    11: new PeekSet("k"),
    12: new PeekSet("l"),
    13: new PeekSet("m"), // can also be 'return'
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
    // 45: new PeekSet("-"), // !
    // 61: new PeekSet("="), // !
    // 48: new PeekSet("0"), // !
    // 49: new PeekSet("1"), // !
    // 27: new PeekSet("3"), // Esc char handled in parseBuffer
    28: new PeekSet(["\\", "4"]),
    29: new PeekSet(["5", "]"]),
    30: new PeekSet(["6", "^"]),
    31: new PeekSet(["7", "/"]),
    127: new PeekSet("8"), // can also be 'backspace'
    // 57: new PeekSet("9"), // !
    // 39: new PeekSet("'"), // !
    // 59: new PeekSet(";"), // !
    // 44: new PeekSet(","), // !
    // 46: new PeekSet("."), // !
};
