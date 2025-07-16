import type { KeyMap } from "../../src/types";
import { match } from "../../src/stateful/match";
import { parseBuffer } from "../../src/parsers/parseBuffer";

export function checkParse(buffer: number[] | string, keymap: KeyMap): boolean {
    const buf =
        typeof buffer === "string"
            ? Buffer.from(buffer, "utf-8")
            : Buffer.from(buffer);

    const data = parseBuffer(buf);
    return match(keymap, data);
}
