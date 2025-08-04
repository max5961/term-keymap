import { queryKittySupport } from "./queryKittySupport.js";

let willRestoreOnExit = false;

export function enableKittyProtocol({
    enabled,
    stdout,
}: {
    enabled?: boolean;
    stdout?: NodeJS.WriteStream;
} = {}): Promise<boolean> {
    enabled = enabled ?? true;
    stdout = stdout ?? process.stdout;

    const sendEnhancement = "\x1b[>8u";
    const restore = "\x1b[<u";

    if (enabled) {
        stdout.write(sendEnhancement);
        if (!willRestoreOnExit) {
            process.on("exit", () => stdout.write(restore));
            willRestoreOnExit = true;
        }
    } else {
        stdout.write(restore);
        willRestoreOnExit = false;
    }

    return queryKittySupport();
}
