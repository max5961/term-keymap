import {
    configureStdin,
    createActions,
    InputState,
    setKittyProtocol,
    setMouse,
} from "../src/index.js";

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
    {
        keymap: "<A-e>",
        name: "enable kitty",
        callback() {
            setKittyProtocol(true, process.stdout, process.stdin);
        },
    },
    {
        keymap: "<A-d>",
        name: "disable kitty",
        callback() {
            setKittyProtocol(false, process.stdout, process.stdin);
        },
    },
    {
        keymap: "<A-m>",
        name: "enable mouse",
        callback() {
            setMouse(true, process.stdout);
        },
    },
    {
        keymap: "<A-n>",
        name: "disable mouse",
        callback() {
            setMouse(false, process.stdout);
        },
    },
]);

const ip = new InputState();

const safeExit = () => {
    // setTimeout(() => {
    //     process.stdout.write("\x1b[<u");
    //     process.exit();
    // }, 1000);
    process.exit();
};
process.stdin.on("data", (buf: Buffer) => {
    if (buf[0] === 3) {
        safeExit();
    }

    console.clear();
    const { data, name } = ip.process(buf, keymaps);

    if (data.key.only("ctrl") && data.input.only("c")) safeExit();

    console.log({
        key: data.key.values(),
        input: data.input.values(),
    });

    if (data.mouse) {
        console.log(data.mouse);
    }

    console.log(name ?? "no match");
});

console.clear();
