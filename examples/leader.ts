import { configureStdin, key, KeyMapState } from "../src/index.js";
import { print } from "./util/prettyPrinter.js";
import { createCb } from "./util/createCb.js";

const state = new KeyMapState({
    leader: " ",
    leaderTimeout: 1000,
    actions: [
        // { leader: true } essentially prepends the configured leader keymap to the
        // given keymap
        {
            keymap: { leader: true, input: "foo" },
            // keymap: key.leader.input("foo")
            // keymap: "<leader>foo"
            // keymap: "[ { leader: true, input: "f" }, { input: "o" }, { input: "o" }]",
            callback: createCb("match <leader>foo"),
        },

        // In string notation
        {
            keymap: "<leader>bar<leader>baz",
            // keymap: key.leader.input("bar").leader.input("baz"),
            // keymap: [ { leader: true, input: "bar" }, { leader: true, input: "baz" }],
            callback: createCb("match <leader>bar<leader>baz"),
        },

        // In keymap builder form
        {
            keymap: key.leader.ctrl.input("b"),
            // keymap: "<leader><C-b>",
            // keymap: [{ leader: true, key: "ctrl", input: "b" }],
            callback: createCb("match <leader><C-b>"),
        },
        {
            keymap: "<C-c>",
            callback() {
                process.exit();
            },
        },
    ],
});

configureStdin();
process.stdin.on("data", (buf: Buffer) => {
    console.clear();
    const { data, keymap } = state.process(buf);
    print(data, keymap);
});
