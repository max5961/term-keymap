import {
    ActionStore,
    InputState,
    configureStdin,
    type Action,
} from "../src/index.js";

configureStdin();

const actions: Action[] = [
    {
        keymap: "<C-A-jk>",
        name: "foo",
        callback() {
            console.log(this.name);
        },
    },
    {
        keymap: "<C-j><C-j><tab>",
        name: "ctrl + j + <tab>",
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
        // keymap: "<leader>brodude",
        keymap: { leader: true, input: "brodude" },
        name: "brodude",
        callback() {
            console.log(this.name);
        },
    },
];

const inputState = new InputState({ leader: " " });
const store = new ActionStore();
actions.forEach((a) => store.addAction(a));

process.stdin.on("data", (buf) => {
    console.clear();

    const { data } = inputState.process(buf, store);

    console.log(data);

    if (buf[0] === 3) {
        process.exit();
    }
});
