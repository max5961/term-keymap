import { queryKittySupport } from "./queryKittySupport.js";

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
        process.on("exit", () => stdout.write(restore));
    } else {
        stdout.write(restore);
    }

    return queryKittySupport();
}
