import EventEmitter from "node:events";
import type { Data } from "./Data.js";

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

    public setMouse = (b: boolean | number): void => {
        this.stream.write(b ? "\x1b[?1000h" : "\x1b[?1000l");

        process.on("exit", () => this.stream.write("\x1b[?1000l"));
    };

    public on = (event: "data", cb: (data: Data) => void): void => {
        this.emitter.on(event, cb);
    };

    private handleData = (buf: Buffer): void => {
        const data: Data = {
            buffer: buf,
            hex: buf.toString("hex"),
            utf: buf.toString("utf-8"),
            key: {},
            input: "",
        };

        // Ctrl character
        if (buf[0] < 32 && buf[0] !== 27) {
            data.key.ctrl = true;

            if (data.utf === "\t") {
                data.key.tab = true;
            }

            if (data.utf === "\r") {
                data.key.return = true;
            }

            if (buf[0] >= 1 && buf[0] <= 26) {
                data.input = String.fromCharCode(buf[0] + 96);
            } else {
                data.input = String.fromCharCode(buf[0]);
            }
        }

        // Mouse event
        else if (buf[0] === 27 && buf[1] === 91 && buf[2] === 77) {
            data.mouse = {
                x: buf[5] - 33,
                y: buf[4] - 33,
                leftBtnDown: buf[3] === 32,
                rightBtnDown: buf[3] === 34,
                scrollBtnDown: buf[3] === 33,
                releaseBtn: buf[3] === 35,
                scrollUp: buf[3] === 96,
                scrollDown: buf[3] === 97,
            };
        }

        // Escape Sequence
        else if (buf[0] === 27) {
            if (data.utf === "\x1b[3~") {
                data.key.delete = true;
            } else if (data.utf === "\x1b[2~") {
                data.key.insert = true;
            } else if (data.utf === "\x1b[A") {
                data.key.up = true;
            } else if (data.utf === "\x1b[B") {
                data.key.down = true;
            } else if (data.utf === "\x1b[C") {
                data.key.right = true;
            } else if (data.utf === "\x1b[D") {
                data.key.left = true;
            } else if (data.utf === "\x1bOP") {
                data.key.f1 = true;
            } else if (data.utf === "\x1bOQ") {
                data.key.f2 = true;
            } else if (data.utf === "\x1bOR") {
                data.key.f3 = true;
            } else if (data.utf === "\x1bOS") {
                data.key.f4 = true;
            } else if (data.utf === "\x1b[15~") {
                data.key.f5 = true;
            } else if (data.utf === "\x1b[17~") {
                data.key.f6 = true;
            } else if (data.utf === "\x1b[18~") {
                data.key.f7 = true;
            } else if (data.utf === "\x1b[19~") {
                data.key.f8 = true;
            } else if (data.utf === "\x1b[20~") {
                data.key.f9 = true;
            } else if (data.utf === "\x1b[21~") {
                data.key.f10 = true;
            } else if (data.utf === "\x1b[23~") {
                data.key.f11 = true;
            } else if (data.utf === "\x1b[24~") {
                data.key.f12 = true;
            }

            // Alt key
            else {
                data.key.alt = true;
                data.input = String.fromCharCode(buf[1]);
            }
        }

        // default
        else {
            data.input = data.utf;
        }

        this.emitter.emit("data", data);
    };
}
