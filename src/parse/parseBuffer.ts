import { PeekSet } from "../helpers/PeekSet.js";
import { LegacyKeys } from "../maps/LegacyKeys.js";
import { parseCtrlChar } from "./parseCtrl.js";
import { parseKittyProtocol } from "./parseKittyProtocol.js";
import type { Data } from "../types.js";
import { parseMouseData } from "./parseMouseData.js";
import { CsiRegex } from "../helpers/CsiRegex.js";
import { CtrlMap } from "../maps/CtrlKeyMap.js";
import { parseLegacyKeys } from "./parseLegacyKeys.js";
import { parseLegacyModifierSequence } from "./parseLegacyModifierSequence.js";

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

    if (CsiRegex.isMouseEvent(data.raw.utf)) {
        parseMouseData(data);
        return data;
    }

    if (CsiRegex.isKittyProtocol(data.raw.utf)) {
        parseKittyProtocol(data);
        return data;
    }

    // Ctrl character
    if (buf[0] in CtrlMap) {
        parseCtrlChar(buf, data);
        return data;
    }

    // Esc alone or alt + esc
    if (buf[0] === 27 && (buf[1] === undefined || buf[1] === 27)) {
        data.key.add("esc");
        data.key.add("ctrl");
        data.input.add("3"); // ambiguity
        data.input.add("["); // ambiguity

        if (buf[1] === 27) data.key.add("alt");

        return data;
    }

    // Special Keys
    if (data.raw.utf in LegacyKeys) {
        parseLegacyKeys(data);
        return data;
    }

    // Special Keys + ctrl|alt
    if (parseLegacyModifierSequence(data)) {
        return data;
    }

    // Alt key
    if (buf[0] === 27) {
        data.key.add("alt");

        if (buf[1] in CtrlMap) {
            const buffArr = Array.from(buf).slice(1);
            parseCtrlChar(Buffer.from(buffArr), data);
        } else {
            data.input.add(String.fromCharCode(buf[1]));
        }

        return data;
    }

    // Default
    data.input.add(data.raw.utf);
    return data;
}
