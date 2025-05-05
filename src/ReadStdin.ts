import EventEmitter from "node:events";
import type { Data } from "./Data.js";
import { EscMap } from "./EscMap.js";

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
        const end = "\x1b[?1000l";
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
            input: "",
        };

        // Ctrl character
        if (buf[0] < 32 && buf[0] !== 27) {
            data.key.ctrl = true;

            if (data.raw.utf === "\t") {
                data.key.tab = true;
            }

            if (data.raw.utf === "\r") {
                data.key.return = true;
            }

            if (buf[0] >= 1 && buf[0] <= 26) {
                data.input = String.fromCharCode(buf[0] + 96);
            } else {
                data.input = String.fromCharCode(buf[0]);
            }
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

        // Escape Sequence
        else if (buf[0] === 27) {
            if (data.raw.utf in EscMap) {
                data.key[EscMap[data.raw.utf]] = true;
            }

            // Alt key
            else {
                data.key.alt = true;
                data.input = String.fromCharCode(buf[1]);
            }
        }

        // default
        else {
            data.input = data.raw.utf;
        }

        this.emitter.emit("data", data);
    };
}
