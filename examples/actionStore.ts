import {
    ActionStore,
    configureStdin,
    InputState,
    type Action,
} from "../src/index.js";

const additional: Action[] = [
    {
        keymap: [{ input: "foo" }, { key: "ctrl", input: "d" }],
        name: "foo<C-d>",
        callback() {
            console.log(this.name);
        },
    },
    {
        keymap: "<C-c>",
        name: "quit",
        callback() {
            process.exit();
        },
    },
];

const actionStore = new ActionStore(" ", 1000);

actionStore.subscribe({
    keymap: "<leader>bar",
    name: "<leader>bar",
    callback() {
        console.log(this.name);
    },
});

configureStdin();

const inputState = new InputState();

process.stdin.on("data", (buf) => {
    inputState.process(buf, actionStore.getCombinedActions(additional));
});
