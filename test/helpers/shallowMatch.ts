import { type Data } from "../../src/types";
import { type KeyMap } from "../../src/stateful/match";

export type ShortData = Pick<Data, "key" | "input">;

export function shallowMatch(keymap: KeyMap, data: ShortData): boolean {
    if (keymap.key && !data.key.size) return false;
    if (!keymap.key && data.key.size) return false;
    if (keymap.input && !data.input.size) return false;
    if (!keymap.input && data.input.size) return false;

    if (keymap.key) {
        if (Array.isArray(keymap.key)) {
            if (!data.key.has(...keymap.key)) return false;
        } else {
            if (!data.key.has(keymap.key)) return false;
        }
    }

    if (keymap.input) {
        if (!data.input.has(keymap.input)) return false;
    }

    return true;
}
