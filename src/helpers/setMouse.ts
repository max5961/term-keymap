export function setMouse(
    b: boolean | number,
    opts: { mode?: 0 | 2 | 3; stream?: NodeJS.ReadStream } = {},
): void {
    opts.mode = opts.mode ?? 3;
    opts.stream = opts.stream ?? process.stdin;

    const end = "\x1b[?1000l\x1b[?1002l\x1b[?1003l";
    const start = `\x1b[?100${opts.mode}h`;

    opts.stream.write(b ? start : end);
    if (b) opts.stream.write("\x1b[?1006h");

    process.on("exit", () => opts.stream!.write(end));
}
