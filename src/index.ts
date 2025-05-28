import { parseBuffer } from "./parse/parseBuffer.js";
import { configureStdin } from "./helpers/configureStdin.js";
import { match, type Match } from "./match/match.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
    enableKittyProtocol: true,
});

// prettier-ignore
const matches: Map<Match, string> = new Map([
    [{ key: ["ctrl", "alt"],  input: "I" },              "foo"],
    [{ key: ["alt", "super"], input: "j" },              "bar"],
    [{ key: ["super"],        input: "u" },              "baz"],
]);

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

    for (const [k, v] of matches) {
        const result = match(k, data);
        if (result) {
            console.log(`matched: ${v}`);
        }
    }

    if (data.key.only("ctrl") && data.input.only("c")) process.exit();
    if (buf[0] === 3) process.exit();
});

console.clear();
console.log("Type something or move the mouse...");
