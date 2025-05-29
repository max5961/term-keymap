import { parseBuffer } from "./parse/parseBuffer.js";
import { configureStdin } from "./configureStdin.js";
import { InputState } from "./stateful/InputState.js";
import { createKeymap } from "./stateful/createKeymap.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
    enableKittyProtocol: true,
});

const keymaps = [
    createKeymap({
        name: "foo",
        keymap: { input: "foo" },
        callback: () => console.log("callback: foo"),
    }),
    createKeymap({
        name: "bar",
        keymap: { input: "b" },
        callback: () => console.log("callback: bar"),
    }),
    createKeymap({
        name: "baz",
        keymap: [{ key: ["super", "ctrl"], input: "Dd" }, { input: "dd" }],
        callback: () => console.log("callback: baz"),
    }),
    createKeymap({
        name: "ban",
        keymap: [
            { key: "alt", input: "j" },
            { key: "ctrl", input: "dddd" },
        ],
        callback: () => console.log("<A-j><C-d><C-d><C-d><C-d>"),
    }),
    createKeymap({
        name: "foobar",
        keymap: Array.from({ length: 5 }).map(() => ({ key: "backspace" })),
        callback: () => console.log("callback: 5 <BS>"),
    }),
];

const ip = new InputState();

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

    const km = ip.process(keymaps, data);
    if (km) console.log(`event: ${km.name}`);

    if (data.key.only("ctrl") && data.input.only("c")) process.exit();
    if (buf[0] === 3) process.exit();
});

console.clear();
console.log("Type something or move the mouse...");
