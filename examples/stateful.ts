import { parseBuffer } from "../src/parse/parseBuffer.js";
import { configureStdin } from "../src/configureStdin.js";
import { InputState } from "../src/stateful/InputState.js";
import { createKeymap } from "../src/stateful/createKeymap.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: false,
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
    createKeymap({
        name: "exit",
        keymap: { key: "ctrl", input: "c" },
        callback: () => process.exit(),
    }),
];

const ip = new InputState();

process.stdin.on("data", (buf: Buffer) => {
    console.clear();
    const data = parseBuffer(buf);
    console.log({
        key: data.key.values(),
        input: data.input.values(),
    });
    ip.process(keymaps, data);
});

console.clear();
