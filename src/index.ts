import { parseBuffer } from "./parse/parseBuffer.js";
import { configureStdin } from "./helpers/configureStdin.js";
import { history } from "./match/history.js";
import type { KeyMap } from "./match/match.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
    enableKittyProtocol: true,
});

const { update, checkMatch } = history();

const keymaps: (KeyMap[] | KeyMap)[] = [
    // { key: ["ctrl", "super"], input: "dddd" },
    { input: "dddd" },
    { input: "j" },
    { input: "foobar" },
];

process.stdin.on("data", (buf: Buffer) => {
    console.clear();

    const data = parseBuffer(buf);
    update(data);

    if (data.mouse) {
        console.log({ raw: data.raw });
        console.log({ mouse: data.mouse });
    } else {
        console.log({ raw: data.raw });
        console.log({ key: data.key.values() });
        console.log({ input: data.input.values() });
    }

    const match = checkMatch(keymaps);
    if (match) console.log(JSON.stringify(match, null, 4));

    if (data.key.only("ctrl") && data.input.only("c")) process.exit();
    if (buf[0] === 3) process.exit();
});

console.clear();
console.log("Type something or move the mouse...");
