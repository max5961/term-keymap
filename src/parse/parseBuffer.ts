import type { Data } from "../types.js";
import { PeekSet } from "../util/PeekSet.js";
import { Decode } from "../util/Decode.js";
import { parseKitty } from "./parseKitty.js";
import { parseLegacy } from "./parseLegacy.js";
import { parseMouse } from "./parseMouse.js";
import { parseXterm } from "./parseXterm.js";

/**
 * @param buf the buffer from the stdin event to parse
 */
export function parseBuffer(buf: Buffer): Data {
    const data: Data = {
        key: new PeekSet(),
        input: new PeekSet(),
        raw: {
            buffer: [...buf],
            utf: buf.toString("utf-8"),
            hex: buf.toString("hex"),
        },
    };

    const encoding = Decode.getEncoding(data.raw.utf);

    if (encoding === "kitty") {
        parseKitty(data);
    } else if (encoding === "legacy") {
        parseLegacy(data);
    } else if (encoding === "mouse") {
        parseMouse(data);
    } else {
        parseXterm(data);
    }

    data.key.delete("numLock");
    data.key.delete("capsLock");
    if (data.input.size) data.key.delete("shift");

    return data;
}
