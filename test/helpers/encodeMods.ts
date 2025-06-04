import type { Key } from "../../src/types";

/**
 * For help sending Kitty CSI sequences
 */
export function encodeMods(modifiers: Key[]): number {
    let num = 0;

    const set = new Set(modifiers);
    if (set.has("shift")) {
        num = num |= 1;
    }
    if (set.has("alt")) {
        num = num |= 2;
    }
    if (set.has("ctrl")) {
        num = num |= 4;
    }
    if (set.has("super")) {
        num = num |= 8;
    }
    if (set.has("hyper")) {
        num = num |= 16;
    }
    if (set.has("meta")) {
        num = num |= 32;
    }
    if (set.has("capsLock")) {
        num = num |= 64;
    }
    if (set.has("numLock")) {
        num = num |= 128;
    }

    return num + 1;
}
