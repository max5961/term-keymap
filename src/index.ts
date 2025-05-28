import { parseBuffer } from "./parse/parseBuffer.js";
import { configureStdin } from "./helpers/configureStdin.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
    enableKittyProtocol: true,
});

process.stdin.on("data", (buf: Buffer) => {
    console.clear();

    const { key, input, mouse, raw } = parseBuffer(buf);

    if (mouse) {
        console.log({ raw });
        console.log({ mouse });
    } else {
        console.log({ raw });
        console.log({ key: key.values() });
        console.log({ input: input.values() });
    }

    if (key.only("ctrl") && input.only("c")) process.exit();
    if (buf[0] === 3) process.exit();
});

console.clear();
console.log("Type something or move the mouse...");
