import type { KeyMap } from "./match.js";

export function normalizeKeymap(keymap: KeyMap | KeyMap[]): KeyMap[] {
    if (Array.isArray(keymap)) {
        if (keymap.length <= 1) return keymap;

        const result: KeyMap[] = [];
        for (const km of keymap) {
            result.push(...normalizeKeymap(km));
        }

        return result;
    }

    if (!keymap.input || keymap.input.length <= 1) {
        return [keymap];
    }

    const stack: KeyMap[] = [];
    const inputs = keymap.input.split("");
    for (const input of inputs) {
        const next: KeyMap = {};
        if (keymap.key && typeof keymap.key === "string") next.key = keymap.key;
        if (keymap.key && Array.isArray(keymap.key)) next.key = [...keymap.key];
        next.input = input;
        stack.push(next);
    }

    return stack;
}
