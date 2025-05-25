export function detectExtendedLayoutSupport(): Promise<boolean> {
    const queries = {
        kittyProgressiveEnhancements: "\x1b[?u",
        deviceAttributes: "\x1b[>0c",
    };

    const regex = /\[\?(\d+)u/gm;

    return new Promise((res) => {
        process.stdout.write(queries.kittyProgressiveEnhancements);
        process.stdout.write(queries.deviceAttributes);

        const handleData = (buf: Buffer) => {
            const utf = buf.toString("utf-8");
            const match = regex.exec(utf);
            if (match && !Number.isNaN(match[1]) && Number(match[1]) !== 0) {
                res(true);
            } else {
                res(false);
            }

            process.stdin.off("data", handleData);
        };

        process.stdin.on("data", handleData);
    });
}
