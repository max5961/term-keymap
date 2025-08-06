import { setKittyProtocol } from "./setKittyProtocol.js";
import { setMouse } from "./setMouse.js";

export type ConfigureReturn = {
    readonly stdout?: NodeJS.WriteStream;
    readonly kittySupported?: boolean;
};

export type Opts = {
    /**
     * The stdin stream that configureStdin puts into raw mode
     * @default process.stdin
     */
    stdin?: typeof process.stdin;

    /**
     * The stdout stream that configuration escape codes are sent to
     * @default process.stdout
     */
    stdout?: NodeJS.WriteStream;

    /**
     * One reason you might *not* want this on is that is may alter the cusor in
     * many terminals and prevent copying text
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
     *
     * @default true (if the terminal does not support it, it does nothing)
     */
    enableKittyProtocol?: boolean;
};

export function configureStdin(opts: Opts = {}) {
    opts.stdin ??= process.stdin;
    opts.stdout ??= process.stdout;
    opts.enableMouse ??= true;
    opts.mouseMode ??= 3;
    opts.enableKittyProtocol ??= true;

    if (!opts.stdin.isTTY) {
        throw new Error("Terminal does not support raw mode.");
    } else {
        opts.stdin.setRawMode(true);
    }

    let kittyEnabled = false;
    setKittyProtocol(opts.enableKittyProtocol, opts.stdout, opts.stdin)?.then(
        (isSupported) => {
            kittyEnabled = isSupported;
        },
    );

    setMouse(opts.enableMouse, opts.stdout, opts.mouseMode);

    return Object.freeze({
        /**
         * The stdout stream chosen in the configuration options
         */
        stdout: opts.stdout,

        /**
         * The stdout stream chosen in the configuration options
         */
        stdin: opts.stdin,

        /**
         * @returns `boolean` representing whether or not the Kitty Protocol is
         * enabled and supported.
         *
         * **NOTE:** This function relies on an async operation that queries the
         * terminal, so calling immediately after configuration will always return
         * `false`
         */
        kittySupported() {
            return kittyEnabled;
        },
    });
}
