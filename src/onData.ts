import { parseBuffer } from "./parse/parseBuffer.js";
import type { Data } from "./types.js";

type Opts = {
    /**
     * The stream from which the function reads *data* from
     * @default process.stdin
     */
    stream?: NodeJS.ReadStream;

    /**
     * Enable/disable mouse
     * @default true
     */
    mouse?: number | boolean;

    /**
     * How many characters should accumulate?  Makes keymapings like *dd* (delete
     * line in vim) possible
     * @default 1
     * */
    registerSize?: number;
};

type Controller = {
    stream: NonNullable<Opts["stream"]>;
    mouse: NonNullable<Opts["mouse"]>;
    registerSize: NonNullable<Opts["registerSize"]>;
    close: () => void;
};

export function handleStream(
    opts: Opts = {},
    handleData: (data: Data) => unknown,
): Controller {
    opts.stream = opts.stream ?? process.stdin;
    opts.registerSize = opts.registerSize ?? 1;
    opts.mouse = opts.mouse ? (opts.mouse === true ? 3 : opts.mouse) : 0;

    const createStreamReader = (stream: NodeJS.ReadStream) => {
        const handler = (buf: Buffer) => {
            const data = parseBuffer(buf);
            handleData(data);
        };
        stream.on("data", handler);

        return () => stream.off("data", handler);
    };

    const streamHandler = {
        detach: createStreamReader(opts.stream),
    };

    return {
        set stream(s: NonNullable<Opts["stream"]>) {
            opts.stream = s;
            streamHandler.detach();
            streamHandler.detach = createStreamReader(opts.stream);
        },
        get stream() {
            return opts.stream!;
        },
        set registerSize(n: NonNullable<Opts["registerSize"]>) {
            opts.registerSize = n;
        },
        get registerSize() {
            return opts.registerSize!;
        },
        set mouse(v: NonNullable<Opts["mouse"]>) {
            opts.mouse = v;
        },
        get mouse() {
            return opts.mouse!;
        },
    };
}

const stream1 = handleStream(_, (data) => {
    //
});
