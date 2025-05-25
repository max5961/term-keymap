import { setMouse } from "./helpers/setMouse.js";
import { setExtendedLayout } from "./helpers/setExtendedLayout.js";
import { detectExtendedLayoutSupport } from "./helpers/isExtendedLayout.js";
import { parseBuffer } from "./parse/parseBuffer.js";

process.stdin.setRawMode(true);
setMouse(true, { stream: process.stdin, mode: 3 });
setExtendedLayout(true);

let isExtendedLayout = false;

detectExtendedLayoutSupport().then((result) => (isExtendedLayout = result));

process.stdin.on("data", (buf: Buffer) => {
    console.clear();

    const { key, input, mouse, raw } = parseBuffer(buf, {
        extendedKb: isExtendedLayout,
    });

    console.log({ raw });
    console.log({ key: key.values() });
    console.log({ input: input.values() });
    console.log({ mouse });

    if (buf[0] === 3) process.exit();
});

console.clear();
console.log("Type something or move the mouse...");
