import {
    configureStdin,
    InputState,
    ActionStore,
    type Action,
} from "../src/index.js";

const actions: Action[] = [
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
    {
        keymap: "<leader>bar",
        name: "<leader>bar",
        callback() {
            console.log(this.name);
        },
    },
];

const store = new ActionStore();
actions.forEach((a) => store.addAction(a));

configureStdin();

const inputState = new InputState({ leader: " ", leaderTimeout: 1000 });

process.stdin.on("data", (buf) => {
    inputState.process(buf, store);
});
