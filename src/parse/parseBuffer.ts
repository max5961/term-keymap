import PeekSet from "../helpers/PeekSet.js";
import { SpecialKeyMap } from "../maps/SpecialKeyMap.js";
import { parseCtrlChar } from "./parseCtrl.js";
import { parseKittyProtocol } from "./parseKittyProtocol.js";
import type { Data } from "../types.js";
import { parseMouseData } from "./parseMouseData.js";
import { CsiRegex } from "../helpers/CsiRegex.js";

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
    }

    if (CsiRegex.isKittyProtocol(data.raw.utf)) {
        parseKittyProtocol(data);
        return data;
    }

    // Ctrl character
    if (buf[0] < 32 && buf[0] !== 27) {
        parseCtrlChar(buf, data);
    }

    // Esc
    else if (buf[0] === 27 && buf[1] === undefined) {
        data.key.add("esc");
    }

    // Special Keys
    else if (data.raw.utf in SpecialKeyMap) {
        data.key.add(SpecialKeyMap[data.raw.utf]);
    }

    // Alt key
    else if (buf[0] === 27) {
        data.key.add("alt");

        if ((buf[1] >= 41 && buf[1] <= 90) || (buf[1] >= 60 && buf[1] <= 126)) {
            data.input.add(String.fromCharCode(buf[1]));
        } else {
            const arr = Array.from(buf).slice(1);
            parseCtrlChar(Buffer.from(arr), data);
        }
    }

    // Default
    else {
        data.input.add(data.raw.utf);
    }

    return data;
}
