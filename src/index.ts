import { parseBuffer } from "./parse/parseBuffer.js";
import { configureStdin } from "./helpers/configureStdin.js";

const cfg = configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
    enableKittyProtocol: true,
});

process.stdin.on("data", (buf: Buffer) => {
    if (buf[0] === 3) process.exit();

    console.clear();

    const { key, input, mouse, raw } = parseBuffer(buf, cfg.kittySupported);

    console.log({ raw });
    console.log({ key: key.values() });
    console.log({ input: input.values() });
    console.log({ mouse });
});

console.clear();
console.log("Type something or move the mouse...");
