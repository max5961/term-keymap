import {
    createActionsWithLeader,
    InputState,
    configureStdin,
} from "../src/index.js";

// **needs a default param**
configureStdin({});

// no leader support yet for string keymaps
const actions = createActionsWithLeader({ input: " " })([
    {
        keymap: "<C-A-jk>",
        name: "foo",
        callback() {
            console.log(this.name);
        },
    },
    {
        keymap: "<C-j><C-j><tab>",
        name: "ctrl + j",
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
]);

const inputState = new InputState();

process.stdin.on("data", (buf) => {
    console.clear();

    const { data } = inputState.process(buf, actions);

    console.log(data);

    if (buf[0] === 3) {
        process.exit();
    }
});
