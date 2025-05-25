/**
 * Queries the terminal for the status of Kitty's extended layout and immediately
 * after queries for primary device attributes.  If no answer is received from
 * Kitty, or if the answer is 'x1b[0u', then the extended layout is not set or supported.
 * Querying for device attributes gaurantees a response so that the Promise can
 * resolve.
 */
export function detectExtendedLayoutSupport(): Promise<boolean> {
    const queries = {
        kittyProgressiveEnhancements: "\x1b[?u",
        deviceAttributes: "\x1b[>0c",
    };

    const regex = /\[\?(\d+)u/gm;

    return new Promise((res) => {
        process.stdout.write(queries.kittyProgressiveEnhancements);
        process.stdout.write(queries.deviceAttributes);

        // Fallback in case incompatible term does not respond
        const timeoutID = setTimeout(() => {
            process.stdin.off("data", handleData);
            res(false);
        }, 250);

        function handleData(buf: Buffer): void {
            const utf = buf.toString("utf-8");
            const match = regex.exec(utf);
            if (match && !Number.isNaN(match[1]) && Number(match[1]) !== 0) {
                res(true);
            } else {
                res(false);
            }

            clearTimeout(timeoutID);
            process.stdin.off("data", handleData);
        }

        process.stdin.on("data", handleData);
    });
}
