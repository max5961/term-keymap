import { enableKittyProtocol } from "./util/enableKittyProtocol.js";
import { enableMouse } from "./util/enableMouse.js";

export type ConfigureReturn = {
    readonly stdout?: NodeJS.WriteStream;
    readonly enableMouse?: typeof enableMouse;
    readonly kittySupported?: boolean;
};

export type Opts = {
    /**
     * The stdout stream that configuration escape codes are sent to
     * @default process.stdout
     */
    stdout?: NodeJS.WriteStream;
    /**
     * One reason you might *not* want this on is that many terminals alter the
     * cursor and might prevent copying text.
     * @default true
     */
    enableMouse?: boolean;

    /**
     * @param 0 button press & release + position on mouse event
     * @param 3 mouse movement events + everything from `0`
     * @default 3
     */
    mouseMode?: 0 | 3;

    /**
     * Enable or disable Kitty's extended keyboard layout
     * @link *https://sw.kovidgoyal.net/kitty/keyboard-protocol/*
     *
     * `configureStdin` returns `{ kittySupported }` which must be passed to
     * parseBuffer in order to parse Kitty protocol sequences
     */
    enableKittyProtocol?: boolean;
};

export function configureStdin(opts: Opts) {
    opts.stdout = opts.stdout ?? process.stdout;
    opts.enableMouse = opts.enableMouse ?? true;
    opts.mouseMode = opts.mouseMode ?? 3;
    opts.enableKittyProtocol = opts.enableKittyProtocol ?? true;

    if (!process.stdin.isTTY) {
        throw new Error("Terminal does not support raw mode.");
    } else {
        process.stdin.setRawMode(true);
    }

    let kittyEnabled = false;
    if (opts.enableKittyProtocol) {
        enableKittyProtocol({
            stdout: opts.stdout,
            enabled: opts.enableKittyProtocol,
        }).then((supported) => (kittyEnabled = supported));
    }

    enableMouse({
        enabled: opts.enableMouse,
        mode: opts.mouseMode,
        stdout: opts.stdout,
    });

    return Object.freeze({
        stdout: opts.stdout,
        enableMouse: enableMouse,
        kittySupported() {
            return kittyEnabled;
        },
    });
}
