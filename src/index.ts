import { parseBuffer } from "./parse/parseBuffer.js";
import { configureStdin } from "./helpers/configureStdin.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
    enableKittyProtocol: false,
});

process.stdin.on("data", (buf: Buffer) => {
    console.clear();

    const data = parseBuffer(buf);

    if (data.mouse) {
        console.log({ raw: data.raw });
        console.log({ mouse: data.mouse });
    } else {
        console.log({ raw: data.raw });
        console.log({ key: data.key.values() });
        console.log({ input: data.input.values() });
    }

    if (data.key.only("ctrl") && data.input.only("c")) process.exit();
    if (buf[0] === 3) process.exit();
});

console.clear();
console.log("Type something or move the mouse...");
