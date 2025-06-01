import { PeekSet } from "../helpers/PeekSet.js";
import { parseKitty } from "./parseKitty.js";
import type { Data } from "../types.js";
import { Decode } from "../helpers/Decode.js";

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
        // parseLegacy
    } else if (encoding === "mouse") {
        // parseMouse
    } else {
        // parseXterm
    }

    data.key.delete("numLock");
    data.key.delete("capsLock");
    if (data.input.size) data.key.delete("shift");

    return data;

    // if (CsiRegex.isMouseEvent(data.raw.utf)) {
    //     parseMouseData(data);
    //     return data;
    // }
    //
    // // Ctrl character
    // if (buf[0] in CtrlMap) {
    //     parseCtrlChar(buf, data);
    //     return data;
    // }
    //
    // // Esc alone or alt + esc
    // if (buf[0] === 27 && (buf[1] === undefined || buf[1] === 27)) {
    //     data.key.add("esc");
    //     data.key.add("ctrl");
    //     data.input.add("3"); // ambiguity
    //     data.input.add("["); // ambiguity
    //
    //     if (buf[1] === 27) data.key.add("alt");
    //
    //     return data;
    // }
    //
    // // Special Keys
    // if (data.raw.utf in LegacyKeys) {
    //     parseLegacyKeys(data);
    //     return data;
    // }
    //
    // // Special Keys + ctrl|alt
    // if (parseLegacyModifierSequence(data)) {
    //     return data;
    // }
    //
    // // Alt key
    // if (buf[0] === 27 && buf.length === 2) {
    //     data.key.add("alt");
    //
    //     if (buf[1] in CtrlMap) {
    //         const buffArr = Array.from(buf).slice(1);
    //         parseCtrlChar(Buffer.from(buffArr), data);
    //     } else {
    //         data.input.add(String.fromCharCode(buf[1]));
    //     }
    //
    //     return data;
    // }
    //
    // // Default
    // if (data.raw.utf && !new RegExp(/^\x1b/).test(data.raw.utf)) {
    //     data.input.add(data.raw.utf);
    // }
    //
    // return data;
}
