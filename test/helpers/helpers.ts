import { parseBuffer } from "../../src/parse/parseBuffer.js";
import { KeyMap, match } from "../../src/stateful/match.js";
import { Data } from "../../src/types.js";

export function checkParse(buffer: number[] | string, keymap: KeyMap): boolean {
    const buf =
        typeof buffer === "string"
            ? Buffer.from(buffer, "utf-8")
            : Buffer.from(buffer);

    const data = parseBuffer(buf);
    return match(keymap, data);
}

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
