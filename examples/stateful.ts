import {
    configureStdin,
    InputState,
    ActionStore,
    setMouse,
    setKittyProtocol,
} from "../src/index.js";
import { createCb } from "./util/createCb.js";
import { print } from "./util/prettyPrinter.js";

const inputState = new InputState();

// Initialize the store with optional Actions
const store = new ActionStore([
    {
        keymap: [{ input: "foo" }, { key: "ctrl", input: "d" }],
        callback: createCb("match foo<C-d>"),
    },

    // If InputState.process matches <C-c> it will return the Action's name if
    // it exists. This provides a different way of handling matched keymaps
    {
        keymap: "<C-c>",
        name: "quit",
    },
]);

// Or add an Action directly.  ActionStore.addAction returns a callback to remove it
// (or you can use ActionStore.removeAction if you have a reference to the Action)
//
// ActionStore.clear() removes all Actions at once

const removeEscAction = store.addAction({
    keymap: "<Esc>",
    callback: createCb("match escape key"),
});
store.addAction({
    keymap: { key: "backspace" },
    callback: createCb("match backspace key"),
});
store.addAction({
    keymap: { key: "return" },
    callback: createCb("match return/enter key"),
});
store.addAction({
    keymap: { input: "a" },
    callback: createCb(
        "having this keymap makes it impossible to match the 'foobar' keymap since shorter keymaps are checked first",
    ),
});
store.addAction({
    keymap: { input: "foobar" },
    callback: createCb(
        "this is impossible to match so long as there is a shorter keymap such as just 'a'",
    ),
});
store.addAction({
    keymap: [
        { key: "ctrl", input: "d" },
        { key: "tab" },
        { key: "ctrl", input: "i" },
    ],
    callback: createCb("matched <C-d><tab><C-i>"),
});
store.addAction({
    keymap: [
        { key: ["super", "ctrl"], input: "Dd" },
        { key: "alt", input: "cc" },
    ],
    callback: createCb("match <D-C-D><D-C-d><A-cc>"),
});
store.addAction({
    keymap: "<A-e>",
    name: "enable kitty",
    callback() {
        createCb("Enabling kitty protocol...")();
        setKittyProtocol(true, process.stdout, process.stdin);
    },
});
store.addAction({
    keymap: "<A-d>",
    name: "disable kitty",
    callback() {
        createCb("Disabling kitty protocol...")();
        setKittyProtocol(false, process.stdout, process.stdin);
    },
});
store.addAction({
    keymap: "<A-m>",
    name: "enable mouse",
    callback() {
        createCb("Enabling mouse support...")();
        setMouse(true, process.stdout);
    },
});
store.addAction({
    keymap: "<A-n>",
    name: "disable mouse",
    callback() {
        createCb("Disabling mouse support...")();
        setMouse(false, process.stdout);
    },
});

configureStdin();
process.stdin.on("data", (buf) => {
    console.clear();
    const { data, keymap, name } = inputState.process(buf, store);
    print(data, keymap);

    if (name === "quit") {
        process.exit();
    }
});
