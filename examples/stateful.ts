import { configureStdin } from "../src/configureStdin.js";
import { createKeymap } from "../src/stateful/createKeymap.js";
import { InputTree } from "../src/stateful/InputTree.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: false,
    enableKittyProtocol: true,
});

const keymaps = [
    // createKeymap({
    //     keymap: [{ key: "tab" }, { key: "tab" }],
    //     name: "TAB_TEST",
    //     callback() {
    //         console.log(this.name + " - matched!");
    //     },
    // }),
    createKeymap({
        keymap: [
            { key: "ctrl", input: "d" },
            { key: "tab" },
            { key: "ctrl", input: "i" },
        ],
        name: "KITTY_TAB_MATCH",
        callback() {
            console.log(this.name + " - matched!");
        },
    }),
];

const ip = new InputTree(50);

process.stdin.on("data", (buf: Buffer) => {
    if (buf[0] === 3) process.exit();

    console.clear();
    const { data, name } = ip.process(buf, keymaps);

    if (data.key.only("ctrl") && data.input.only("c")) process.exit();

    console.log({
        key: data.key.values(),
        input: data.input.values(),
    });

    console.log(name ?? "no match");
});

console.clear();
