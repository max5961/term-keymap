import { configureStdin, parseBuffer } from "../src/index.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
});

process.stdin.on("data", (buf) => {
    const data = parseBuffer(buf);

    if (data.mouse) {
        console.clear();
        console.log({ utf: data.raw.utf });
        console.log(data.mouse);
    }

    if (data.key.only("ctrl") && data.input.only("c")) {
        process.exit();
    }
});

console.clear();
