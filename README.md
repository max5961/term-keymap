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

<!-- - [Full API Reference](./doc/API.md) -->
<!-- - [Using parseBuffer as a Standalone](./doc/parseBuffer.md) -->
<!-- - [Example Setups](./doc/examples.md) -->

[Example Setups](./examples)

# Quickstart

### Matching stateful stdin with keymaps

```typescript
import { , configureStdin, ActionStore, InputState } from "term-input";

configureStdin({
    enableMouse: true,
    enableKittyProtocol: true,
})

const inputState = new InputState({ key: "ctrl", input: " " });

// Initialize the store with optional Actions
const store = new ActionStore([
    {
        keymap: [{ input: "foo" }, { key: "ctrl", input: "d" }],
        callback: () => {
            // handle match
        }
    },

    // KeyMaps can be set in string form as well
    {
        keymap: "<leader>bar"
        callback: () => {
            // handle match
        }
    }

    // If InputState.process matches <C-c> it will return the Action's name if
    // it exists. This provides a different way of handling matched keymaps
    {
        keymap: "<C-c>",
        name: "quit",
    },
]);

// Or add an Action directly.  ActionStore.addAction returns a callback to remove it
// (or you can use ActionStore.removeAction if you have a reference to the Action)
//
// ActionStore.clear() removes all Actions at once

const removeEscAction = store.addAction({
    keymap: "<Esc>",
    callback: createCb("match escape key"),
});

process.stdin.on("data", (buf: Buffer) => {
    const { data, name } = inputState.process(buf, actions);

    // data provides parsed key/input sets (including ambiguities if any)

    // If there is a match, and you chose not to assign a callback, you handle
    // the `name` manually here.
    if (name === "quit") {
        process.exit();
    }

    if (data.mouse) {
        // Handle mouse data here
    }
})
```



### Handling raw data

>`parseBuffer` provides direct stdin parsing when stateful matching provided
>by `InputState` and `ActionStore` isn't needed. It returns a `Data` object
>which contains the parsed info. `Data.key` and `Data.input` are extended Set
>objects with an `only(...values)` method for easier matching.

```typescript
configureStdin({
    enableMouse: false,
    enableKittyProtocol: true,
});

process.stdin.on("data", (buf: Buffer) => {
    console.clear();

    const data = parseBuffer(buf);

    print(data);

    if (data.key.only("backspace")) {
        // handler
    }
    if (!data.key.size && data.input.only("a")) {
        // handler
    }
    if (data.key.only("ctrl") && data.input.only("a")) {
        // handler
    }
    if (data.key.only("ctrl", "alt", "super") && data.input.only("U")) {
        // handler
    }

    if (data.key.only("ctrl") && data.input.only("c")) {
        process.exit();
    }
});
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



