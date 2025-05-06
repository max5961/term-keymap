import EventEmitter from "node:events";
import type { Data } from "./Data.js";
import { SpecialKeyMap } from "./EscMap.js";
import { parseCtrlChar } from "./parseCtrl.js";

export class ReadStdin {
    private stream: NodeJS.ReadStream;
    private emitter: EventEmitter;

    constructor(stream: NodeJS.ReadStream = process.stdin) {
        this.stream = stream;
        this.emitter = new EventEmitter();
    }

    public listen = (): void => {
        this.stream.on("data", this.handleData);
    };

    public pause = (): void => {
        this.stream.off("data", this.handleData);
    };

    public setMouse = (
        b: boolean | number,
        opts: { mode: 0 | 2 | 3 } = { mode: 3 },
    ): void => {
        const end = "\x1b[?1000l\x1b[?1002l\x1b[?1003l";
        const start = `\x1b[?100${opts.mode}h`;

        this.stream.write(b ? start : end);
        if (b) this.stream.write("\x1b[?1006h");

        process.on("exit", () => this.stream.write(end));
    };

    public on = (event: "data", cb: (data: Data) => void): void => {
        this.emitter.on(event, cb);
    };

    private handleData = (buf: Buffer): void => {
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

            if (
                (buf[1] >= 41 && buf[1] <= 90) ||
                (buf[1] >= 60 && buf[1] <= 126)
            ) {
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

        this.emitter.emit("data", data);
    };
}
