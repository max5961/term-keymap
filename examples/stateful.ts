import { configureStdin, createActions, InputState } from "../src/index.js";

configureStdin({
    stdout: process.stdout,
    enableMouse: false,
    enableKittyProtocol: true,
});

const keymaps = createActions([
    {
        keymap: { input: "a" },
        name: "shortest wins",
    },
    {
        keymap: [
            { key: "ctrl", input: "d" },
            { key: "tab" },
            { key: "ctrl", input: "i" },
        ],
        name: "KITTY_TAB_MATCH",
        callback() {
            console.log(this.name + " - matched!");
        },
    },
    {
        keymap: { input: "foobar" },
        name: "FOOBAR",
        callback() {
            console.log(this.name + " - matched!");
        },
    },
    {
        keymap: [
            { key: ["super", "ctrl"], input: "Dd" },
            { key: "alt", input: "cc" },
        ],
        name: "long",
        callback() {
            console.log(this.name + " - matched!");
        },
    },
]);

const ip = new InputState();

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
