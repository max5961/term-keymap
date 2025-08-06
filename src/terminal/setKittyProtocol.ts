import { queryKittySupport } from "./queryKittySupport.js";

/**
 * Spam requesting the kitty protocol may lead to inability to exit the protocol
 * post app exit.
 * */
const isEnabled = new Map<NodeJS.WriteStream, boolean>();

export function setKittyProtocol<T extends boolean>(
    enable: T,
    stdout: NodeJS.WriteStream,
    stdin: typeof process.stdin,
): Promise<boolean> | void {
    if (enable && isEnabled.get(stdout)) {
        return;
    }

    isEnabled.set(stdout, enable);

    if (enable) {
        return enableKittyProtocol({
            stdout,
            stdin,
        });
    } else {
        return disableKittyProtocol(stdout);
    }
}

let willRestoreOnExit = false;

function enableKittyProtocol({
    stdout,
    stdin,
}: {
    stdout?: NodeJS.WriteStream;
    stdin?: NodeJS.ReadStream;
} = {}): Promise<boolean> {
    stdout ??= process.stdout;
    stdin ??= process.stdin;

    const sendEnhancement = "\x1b[>8u";

    stdout.write(sendEnhancement);
    if (!willRestoreOnExit) {
        process.on("exit", () => disableKittyProtocol(stdout));
        willRestoreOnExit = true;
    }

    return queryKittySupport(stdout, stdin);
}

function disableKittyProtocol(stdout: NodeJS.WriteStream) {
    const restore = "\x1b[<u";
    stdout.write(restore);
}
