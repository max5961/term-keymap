import {
    createActionsWithLeader,
    configureStdin,
    InputState,
} from "../src/index.js";

configureStdin({});

const ip = new InputState();

const keymaps = createActionsWithLeader({ input: " " })([
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
]);

process.stdin.on("data", (buf: Buffer) => {
    if (buf[0] === 3) process.exit();

    const { data, name } = ip.process(buf, keymaps);

    console.clear();
    console.log(data);

    console.log(name ?? "no match!");

    if (data.key.only("ctrl") && data.input.only("c")) process.exit();
});
