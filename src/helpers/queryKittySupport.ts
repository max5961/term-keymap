/**
 * Queries the terminal for the status of Kitty's extended layout and immediately
 * after queries for primary device attributes.  If no answer is received from
 * Kitty, or if the answer is 'x1b[0u', then the extended layout is not set or supported.
 * Querying for device attributes gaurantees a response so that the Promise can
 * resolve.
 */

/**
 * @returns a Promise<boolean> representing support for Kitty's keyboard protcol.
 *
 * Queries the terminal for the status for Kitty's keyboard protocol, and immediately
 * after queryies for primary device attributes.  Querying for device attr gaurantees
 * a response.  If the Kitty protocol does not respond then the terminal does
 * not support the protocol.  If Kitty responds with 'x1b[0u' then it is supported,
 * but not turned on and the Promise still returns false.
 */
export function queryKittySupport(): Promise<boolean> {
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
