import type { Data, KeyMap } from "../types.js";

export function match<T extends Pick<Data, "key" | "input">>(
    keymap: KeyMap,
    data: T,
): boolean {
    if (keymap.input) {
        if (keymap.input.length > 1) return false;
        if (keymap.input.length !== data.input.size) return false;
        if (!data.input.has(keymap.input)) return false;
    } else if (data.input.size) {
        return false;
    }

    if (keymap.key && keymap.key.length) {
        if (Array.isArray(keymap.key)) {
            if (!data.key.only(...keymap.key)) return false;
        } else {
            if (!data.key.only(keymap.key)) return false;
        }
    } else if (data.key.size) {
        return false;
    }

    if ((!keymap.key || !keymap.key.length) && !keymap.input) return false;

    return true;
}
