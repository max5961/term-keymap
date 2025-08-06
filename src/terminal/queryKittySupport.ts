/**
 * Queries the terminal for the status for Kitty's keyboard protocol, and immediately
 * after queryies for primary device attributes.  Querying for device attr gaurantees
 * a response.  If the Kitty protocol does not respond then the terminal does
 * not support the protocol.  If Kitty responds with `x1b[0u` then it is supported,
 * but not turned on and the Promise still returns false.
 */
export function queryKittySupport(
    stdout: NodeJS.WriteStream,
    stdin: NodeJS.ReadStream,
): Promise<boolean> {
    const queries = {
        kittyProgressiveEnhancements: "\x1b[?u",
        deviceAttributes: "\x1b[>0c",
    };

    const regex = /\[\?(\d+)u/gm;

    return new Promise((res) => {
        stdout.write(queries.kittyProgressiveEnhancements);
        stdout.write(queries.deviceAttributes);

        // Fallback in case incompatible term does not respond
        const timeoutID = setTimeout(() => {
            stdin.off("data", handleData);
            res(false);
        }, 50);

        function handleData(buf: Buffer): void {
            const utf = buf.toString("utf-8");
            const match = regex.exec(utf);
            if (match && !Number.isNaN(match[1]) && Number(match[1]) !== 0) {
                res(true);
            } else {
                res(false);
            }

            clearTimeout(timeoutID);
            stdin.off("data", handleData);
        }

        stdin.on("data", handleData);
    });
}
