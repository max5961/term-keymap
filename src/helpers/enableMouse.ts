export function enableMouse({
    enabled,
    mode,
    stdout,
}: { enabled?: boolean; mode?: 0 | 3; stdout?: NodeJS.WriteStream } = {}) {
    enabled = enabled ?? true;
    mode = mode ?? 3;
    stdout = stdout ?? process.stdout;

    const end = "\x1b[?1000l\x1b[?1002l\x1b[?1003l";
    const start = `\x1b[?100${mode}h`;

    stdout.write(enabled ? start : end);
    if (enabled) stdout.write("\x1b[?1006h");

    process.on("exit", () => stdout!.write(end));
}
