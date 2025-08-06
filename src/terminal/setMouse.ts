import type { Opts } from "./configureStdin.js";

let willRestoreOnExit = false;

export function setMouse(
    enabled: boolean,
    stdout: NodeJS.WriteStream,
    mode?: Opts["mouseMode"],
) {
    mode ??= 3;
    if (enabled) {
        enableMouse({
            mode,
            stdout,
        });
    } else {
        disableMouse(stdout);
    }
}

function enableMouse({
    mode,
    stdout,
}: { mode?: 0 | 3; stdout?: NodeJS.WriteStream } = {}) {
    mode = mode ?? 3;
    stdout = stdout ?? process.stdout;

    const start = `\x1b[?100${mode}h`;

    stdout.write(start + "\x1b[?1006h");

    if (!willRestoreOnExit) {
        process.on("exit", () => disableMouse(stdout));
        willRestoreOnExit = true;
    }
}

function disableMouse(stdout: NodeJS.WriteStream) {
    const end = "\x1b[?1000l\x1b[?1002l\x1b[?1003l";
    stdout.write(end);
}
