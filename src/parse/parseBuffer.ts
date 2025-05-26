import PeekSet from "../helpers/PeekSet.js";
import { SpecialKeyMap } from "../maps/SpecialKeyMap.js";
import { parseCtrlChar } from "./parseCtrl.js";
import { parseExtendedKb } from "./parseExtendedKb.js";
import type { Data } from "../types.js";

export function parseBuffer(buf: Buffer, opts = { extendedKb: false }): Data {
    const data: Data = {
        key: new PeekSet(),
        input: new PeekSet(),
        raw: {
            buffer: [...buf],
            utf: buf.toString("utf-8"),
            hex: buf.toString("hex"),
        },
    };

    if (opts.extendedKb) {
        parseExtendedKb(data);
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

    // Mouse Event
    else if (buf[0] === 27 && buf[1] === 91 && buf[2] === 60) {
        const regex = /<(\d+);(\d+);(\d+)(m)$/gim;
        const mousedata = regex.exec(data.raw.utf);

        if (mousedata) {
            const event = Number(mousedata[1]);
            const x = Number(mousedata[2]) - 1;
            const y = Number(mousedata[3]) - 1;
            const down = mousedata[4] === "M";

            data.mouse = {
                x,
                y,
                leftBtnDown: (event === 0 && down) || event === 32,
                rightBtnDown: (event === 2 && down) || event === 34,
                scrollBtnDown: (event === 1 && down) || event === 33,
                releaseBtn: !down,
                scrollUp: event === 64,
                scrollDown: event === 65,
                mousemove: event >= 32 && event <= 35,
            };
        }
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
