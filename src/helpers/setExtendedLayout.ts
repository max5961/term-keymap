export function setExtendedLayout(
    enhance: boolean,
    opts = { stdout: process.stdout },
): void {
    const sendEnhancement = "\x1b[>8u";
    const restore = "\x1b[<u";

    if (enhance) {
        opts.stdout.write(sendEnhancement);
        // Restore to normal mode
        process.on("exit", () => opts.stdout.write("\x1b[<u"));
    } else {
        opts.stdout.write(restore);
    }
}
