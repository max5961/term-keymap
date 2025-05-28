import { parseBuffer } from "./parse/parseBuffer.js";
import { configureStdin } from "./helpers/configureStdin.js";

const cfg = configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
    enableKittyProtocol: true,
});

cfg.enableMouse({ enabled: true, mode: 3 });

process.stdin.on("data", (buf: Buffer) => {
    console.clear();

    const { key, input, mouse, raw } = parseBuffer(buf, cfg.kittySupported);

    if (mouse) {
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
