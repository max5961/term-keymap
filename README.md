*Reads keyboard and mouse stdin (clicks, movement, scroll) from the terminal and
returns structured, readable data.  Supports a wide range of possible key
combinations, and includes support for the [Kitty Keyboard
Protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/), while also
maintaining compatibility for terminals that do not support it.  Provides
utilities for checking keymaps and matching input against a stateful history of
keystrokes.*

---

## Handling Raw Data

```typescript
// parseBuffer is not dependent on configureStdin, so this is not always necessary
configureStdin({
    stdout: process.stdout,
    enableMouse: false,
    enableKittyProtocol: true,
});

process.stdin.on("data", (buf: Buffer) => {
    const data = parseBuffer(buf);
    console.log({ raw: data.raw });
    console.log({ key: data.key.values() });
    console.log({ input: data.input.values() });

    // data.key and data.input values are stored in an extended Set object for
    // for easier parsing.  `only` method allows checking if the set contains
    // only the specified values.
    if (data.key.only("ctrl") && data.input.only("c")) {
        process.exit();
    }
    if (data.key.only("backspace")) {
        console.log("\nmatch: backspace");
    }
    if (!data.key.size && data.input.only("a")) {
        console.log("\nmatch: a");
    }
    if (data.key.only("ctrl") && data.input.only("a")) {
        console.log("\nmatch: <C-a>");
    }
    if (data.key.only("ctrl", "alt", "super") && data.input.only("U")) {
        console.log("\nmatch: ctrl + alt + super + U");
    }
})
```

---

## Handling Stateful Keymap Matching

```typescript
configureStdin({
    stdout: process.stdout,
    enableMouse: false,
    enableKittyProtocol: true,
});

const keymaps = [
    createKeymap({
        keymap: { key: "ctrl", input: "c" },
        name: "quit",
        callback() {
            process.exit();
        }
    }),
    createKeymap({
        keymap: { input: "a" },
        name: "shortest keymap wins",
        callback() {
            console.log(this.name + " - match")
        }
    }),
    createKeymap({
        keymap: { input: "abc" },
        name: "Impossible, because 'a' will always match before this",
        callback() {
            console.log(this.name);
        }
    }),
    createKeymap({
        keymap: [
            { key: "ctrl", input: "foo" },
            { key: "super", input: "BAR" },
        ],
        name: "Ctrl + super + characters",
        callback() {
            console.log(this.name + " - matched!");
        },
    }),
];

const state = new InputState();

process.stdin.on("data", (buf: Buffer) => {
    const { data, name } = state.process(buf, keymaps);

    if (data.key.only("ctrl") && data.input.only("c")) process.exit();

    console.clear();
    console.log({
        key: data.key.values(),
        input: data.input.values(),
    });

    console.log(name ?? "no match");
})
```

---

## Handling Mouse Data

```typescript
configureStdin({
    stdout: process.stdout,
    enableMouse: true,
    mouseMode: 3,
});

process.stdin.on("data", (buf) => {
    const data = parseBuffer(buf);

    if (data.mouse) {
        console.clear();
        console.log({ utf: data.raw.utf });
        console.log(data.mouse);
    }

    if (data.key.only("ctrl") && data.input.only("c")) {
        process.exit();
    }
});
```
