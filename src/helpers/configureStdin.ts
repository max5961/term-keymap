import { enableKittyProtocol } from "./enableKittyProtocol.js";
import { enableMouse } from "./enableMouse.js";

export type ConfigureReturn = {
    readonly stdout?: NodeJS.WriteStream;
    readonly enableMouse?: typeof enableMouse;
    readonly kittySupported?: boolean;
};

export type Opts = {
    stdout?: NodeJS.WriteStream;
    enableMouse?: boolean;
    mouseMode?: 0 | 2 | 3;
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
    enableKittyProtocol({
        stdout: opts.stdout,
        enabled: opts.enableKittyProtocol,
    }).then((supported) => (kittyEnabled = supported));

    enableMouse({
        enabled: opts.enableMouse,
        mode: opts.mouseMode,
        stdout: opts.stdout,
    });

    return Object.freeze({
        stdout: opts.stdout,
        enableMouse: enableMouse,
        get kittySupported() {
            return kittyEnabled;
        },
    });
}
