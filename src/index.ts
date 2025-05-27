import { enableMouse } from "./helpers/enableMouse.js";
import { enableKittyProtocol } from "./helpers/enableKittyProtocol.js";
import { parseBuffer } from "./parse/parseBuffer.js";

process.stdin.setRawMode(true);
enableMouse();

let kittySupported = false;
enableKittyProtocol().then((result) => (kittySupported = result));

process.stdin.on("data", (buf: Buffer) => {
    if (buf[0] === 3) process.exit();

    console.clear();

    const { key, input, mouse, raw } = parseBuffer(buf, {
        kittyProtocol: kittySupported,
    });

    console.log({ raw });
    console.log({ key: key.values() });
    console.log({ input: input.values() });
    console.log({ mouse });
});

console.clear();
console.log("Type something or move the mouse...");
