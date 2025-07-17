# term-keymap

*Parses raw keyboard and mouse stdin buffers in Node and returns structured
data.  Provides a flexible keymap API with support for dynamically assigning and
removing keymaps at runtime.*

*Supports a wide range of key combinations, mouse actions, and full
compatibility with the [Kitty Keyboard
Protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/)*

Key features:
- **Comprehensive Key Combination**: Parses `ctrl` and `alt` combinations by default.
- **Kitty Keyboard Protocol Support**: Enables extended combinations if
  supported by the terminal (e.g. `ctrl` + uppercase characters, `super`,
  `meta`, volume keys).
- **Dynamic Keymap API**: Subscribe/unsubscribe individual keymaps at runtime.
  Supports sequences, leader/prefix keys, optional callbacks and names.
- **Mouse Support**: movement, buttons, scroll, drag, release.
- **Vim-style Keymap Strings**: `"<C-a><Tab>foo"` notation or structured token
  objects.
- **Raw Stdin Buffer Parser**: Bypass the keymap API and directly use the parsed
  buffer data if desired.

# Documentation & Resources

- [Full API Reference](./doc/API.md)
- [Using parseBuffer as a Standalone](./doc/parseBuffer.md)
- [Example Setups](./doc/examples.md)

# Quickstart

### Static Keymaps

```typescript
import { createActionsWithLeader, configureStdin, InputState } from "term-input";

configureStdin({
    enableMouse: true,
    enableKittyProtocol: true,
})

// `createActions` if no leader key desired
const actions = createActionsWithLeader(" ")([
    {
        keymap: { key: "ctrl", input: "c" },
        name: "quit",
        callback: () => process.exit(),
    },
    {
        // Keymaps can be string-form, or structured token objects such as above
        keymap: "<C-j>",
        name: "Ctrl + j",
    },
    {
        // Sequence of keypresses using the leader key we defined (" ")
        keymap: [{ leader: true, input: "foo" }, { key: "ctrl", input: "bar" }],
        name: "<leader>foo<C-bar>",
    }
])

const inputState = new InputState();

process.stdin.on("data", (buf: Buffer) => {
    const { data, name } = inputState.process(buf, actions);

    // data provides parsed key/input sets (including ambiguities if any)

    // If there is a match, and you chose not to assign a callback, you handle
    // the `name` manually here.

    if (data.mouse) {
        // Handle mouse data here
    }
})
```

### Dynamic Keymaps

>Subscribe or unsubscribe actions at runtime based on the state of the app.
>Useful if the app requires context specific keymaps.

```typescript
import { ActionStore, Action, configureStdin } from "term-input";

configureStdin();

const store = new ActionStore({ leader: " " });
const inputState = new InputState();

const quitAction: Action = { keymap: "<C-c>", name: "quit", callback: () => process.exit() }
store.subscribe(quitAction);

process.stdin.on("data", () => {
    inputState.process(buf, store.getActions());
})

// Elsewhere in your code...
const showData: Action = {
    keymap: "<A-r>",
    name : "show-data",
    callback: toggleShowData,
}

// `subscribe` returns an unsubscribe function
// useful for when you don't want to hold onto the Action object directly
const unsubscribeShowData = store.subscribe(showData);
```


### Handling raw data

>Want to handle stdin manually without the keymap API? You can parse raw
>input directly.

```typescript
configureStdin({
    enableMouse: false,
    enableKittyProtocol: true,
});

process.stdin.on("data", (buf: Buffer) => {
    const data = parseBuffer(buf);

    // data.key and data.input are enhanced Sets, most notably with an `only()`
    // method that helps narrow results easier.

    console.log({ raw: data.raw });
    console.log({ key: data.key.values() });
    console.log({ input: data.input.values() });

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

    // Requires Kitty keyboard support
    if (data.key.only("ctrl", "alt", "super") && data.input.only("U")) {
        console.log("\nmatch: ctrl + alt + super + U");
    }
})
```

### Mouse Data


| Property | Type | Description |
|----------|------|-------------|
| x | number | 0 based x index of cursor within term window |
| y | number | 0 based y index of cursor within term window |
| leftBtnDown | boolean | true when left mouse button pressed |
| rightBtnDown | boolean | true when right mouse button pressed |
| scrollBtnDown | boolean | true when scroll button is *down* (not the same as scrolling with the scroll wheel)
| releaseBtn | boolean | true immediately after releasing any of the trackable mouse button |
| scrollUp | boolean | true when scrolling up on the scroll wheel |
| scrollDown | boolean | true when scroll down on the scroll wheel |
| mousemove | boolean | true when mouse is moving within term window |




