import { parseBuffer } from "../src/parse/parseBuffer.js";
import { configureStdin } from "../src/configureStdin.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
});

process.stdin.on("data", (buf) => {
    const data = parseBuffer(buf);

    if (data.mouse) {
        console.clear();
        console.log(data.mouse);
    }

    if (data.key.only("ctrl") && data.input.only("c")) {
        process.exit();
    }
});

console.clear();
