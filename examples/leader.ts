import { configureStdin, InputState, ActionStore, key } from "../src/index.js";
import { print } from "./util/prettyPrinter.js";
import { createCb } from "./util/createCb.js";

// leader can be a `KeyMap | KeyMap[] | string`
// For example, leader could be:
// - " "
// - { key: "f1" }
// - [{ key: "f1" }, { input: "foo"}]
const inputState = new InputState({ leader: " ", leaderTimeout: 1000 });
const store = new ActionStore([
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
        // keymap: "<leader>bar<leader>baz",
        keymap: key.leader.input("bar").leader.input("baz"),
        // keymap: [ { leader: true, input: "bar" }, { leader: true, input: "baz" }],
        callback: createCb("match <leader>bar<leader>baz"),
    },
    {
        keymap: "<C-c>",
        callback() {
            process.exit();
        },
    },
    {
        // keymap: "<leader><leader><leader>lol",
        keymap: key.leader.leader.leader.input("lol"),
        callback: createCb("multiple leaders"),
    },
    {
        keymap: key.input("foo").leader.backspace,
        callback: createCb("input before leader then backspace"),
    },
]);

configureStdin();
process.stdin.on("data", (buf: Buffer) => {
    console.clear();

    const { data, keymap } = inputState.process(buf, store);
    print(data, keymap);
});
