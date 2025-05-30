import { parseBuffer } from "../../src/parse/parseBuffer.js";
import { KeyMap, match } from "../../src/stateful/match.js";

export function checkParse(buffer: number[] | string, keymap: KeyMap): boolean {
    const buf = Buffer.from(buffer);
    const data = parseBuffer(buf);
    return match(keymap, data);
}
