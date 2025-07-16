import { configureStdin, parseBuffer } from "../src/index.js";

configureStdin({
    enableMouse: false,
    enableKittyProtocol: true,
});

process.stdin.on("data", (buf: Buffer) => {
    console.clear();

    const data = parseBuffer(buf);
    if (data.key.only("ctrl") && data.input.only("c")) process.exit();

    console.log({ raw: data.raw });
    console.log({ key: data.key.values() });
    console.log({ input: data.input.values() });

    if (data.key.only("backspace")) {
        console.log("\nmatch: backspace");
    }
    if (!data.key.size && data.input.only("a")) {
        console.log("\nmatch: a");
    }
    if (data.key.only("ctrl") && data.input.only("a")) {
        console.log("\nmatch: <C-a>");
    }
    if (data.key.only("ctrl", "alt", "super") && data.input.only("U")) {
        console.log("\nmatch: ctrl + alt + super + U");
    }
});

console.clear();
