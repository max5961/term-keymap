import { parseCtrlChar } from "./parseCtrl.js";
import { SpecialKeyMap } from "./EscMap.js";
import type { Data } from "./Data.js";

export function parseBuffer(buf: Buffer): Data {
    const data: Data = {
        raw: {
            buffer: buf,
            hex: buf.toString("hex"),
            utf: buf.toString("utf-8"),
        },
        key: {},
        input: new Set(),
        get defaultInput(): string {
            for (const value of this.input.values()) return value;
            return "";
        },
    };

    // Ctrl character
    if (buf[0] < 32 && buf[0] !== 27) {
        parseCtrlChar(buf, data);
    }

    // Esc
    else if (buf[0] === 27 && buf[1] === undefined) {
        data.key.esc = true;
    }

    // Mouse event
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
        data.key[SpecialKeyMap[data.raw.utf]] = true;
    }

    // Alt key
    else if (buf[0] === 27) {
        data.key.alt = true;

        if ((buf[1] >= 41 && buf[1] <= 90) || (buf[1] >= 60 && buf[1] <= 126)) {
            data.input.add(String.fromCharCode(buf[1]));
        } else {
            const arr = Array.from(buf).slice(1);
            parseCtrlChar(Buffer.from(arr), data);
        }
    }

    // default
    else {
        data.input.add(data.raw.utf);
    }

    return data;
}
