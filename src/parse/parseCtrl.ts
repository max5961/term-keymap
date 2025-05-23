import { CtrlMap } from "../maps/CtrlKeyMap.js";
import { type Data } from "../types.js";

export function parseCtrlChar(buf: Buffer, data: Data): void {
    const num = buf[0];

    // Return if out of range or escape character
    if (num > 127 || num === 27) return;

    if (num in CtrlMap) {
        data.key.add("ctrl");
        data.input = CtrlMap[num];
    }

    // Ambiguous mappings update both input and the key
    if (num === 9) data.key.add("tab");
    if (num === 13) data.key.add("return");
}
