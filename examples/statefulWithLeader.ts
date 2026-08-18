import {
    configureStdin,
    InputState,
    ActionStore,
    type Action,
} from "../src/index.js";

configureStdin({});

const ip = new InputState({ leader: { key: ["ctrl", "f8"] } });
const actions: Action[] = [
    {
        keymap: { leader: true, input: "foo" },
        name: "leader-foo",
        callback() {
            console.log(this.name);
        },
    },
    {
        keymap: { input: "bar" },
        name: "bar",
        callback() {
            console.log(this.name);
        },
    },
];

const store = new ActionStore();
actions.forEach((a) => store.addAction(a));

process.stdin.on("data", (buf: Buffer) => {
    if (buf[0] === 3) process.exit();

    const { data, name, keymap } = ip.process(buf, store);

    console.clear();
    console.log(data, keymap);

    console.log(name ?? "no match!");

    if (data.key.only("ctrl") && data.input.only("c")) process.exit();
});
