### [Kitty Keyboard Protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/)

To get the most out of terminal input, this project utilizes the Kitty Keyboard
Protocol, by which `configureStdin` enables by default.  This allows for more
complex key combinations and disambiguates certain key codes.

If the terminal at runtime does not support the Kitty Protocol, then it is
backwards compatible with sequences sent by legacy terminals.

---

### `Modifier` union type

```typescript
type Modifier = "ctrl" | "alt" | "shift" | "super" | "hyper" | "meta" | "capsLock" | "numLock";
```

The `Modifier` union type represents all of the keys that can be combined with
other keys.  For example, `F1` is **not** a modifier and thus cannot be mapped
with the character `a`.  However, `ctrl` is a modifier and can be combined with
other modifiers or non-modifiers.

#### Usage Notes

The usage of modifiers other than `ctrl` and `alt` are dependent on support for
the [Kitty Keyboard
Protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/).

While `shift` is technically a modifier, it is usually parsed out of
combinations.  For example, stdin of `A` is returned as `A` rather than `shift +
a`.

`numLock` and `capsLock` are also parsed out in the current implementation.

The API intentionally does not allow for modifiers without any non-modifier
counterparts to match any defined keymaps.  However, `data` returned from
`parseBuffer` or `InputState.process` includes standalone modifiers.

---

### `Key` union type

Contains all of the modifier keys in addition to keys such as function keys.

#### Usage Notes

Although the KeyMap interface will allow you to combine non-modifier keys with
alphanumeric input, terminals only emit combinations involving modifiers.

Usage of extended keys like `mediaPlay` require the [Kitty Keyboard
Protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/).

---

### `KeyMap` interface

```typescript
type KeyMap = { key?: Key | Key[]; input?: string; leader?: boolean };
```

#### Examples
```typescript
// Ctrl + 'c'
const example1: KeyMap = { key: "ctrl", input: "c" };

// Ctrl + Alt + 'c'
const example2: KeyMap = { key: ["ctrl", "alt"], input: "c" };

// `Ctrl + f` + `Ctrl + o` + `Ctrl + o`
const example3: KeyMap = { key: "ctrl", input: "foo" };

// If we have set a global leader key this would expand to:
// <leader> + `f` + `o` + `o`
const example4: KeyMap = { leader: true, input: "foo" };
```

>[!NOTE]
>Setting leader to `true` prepends the leader KeyMap to that current KeyMap
>during processing.

---

### `Action` interface

The `Action` type groups keymaps with optional callbacks or a name.  It lets you
dispatch a callback or emit an event when stdin matches the given action.

```typescript
type Action = {
    keymap: string | KeyMap | KeyMap[];
    callback?: () => unknown;
    name?: string;
}
```

#### Usage Notes

The `keymap` property is overloaded to support a [Vim-style
keymap](./string-keymaps.md) in the form of a string, or one or more `KeyMap`
objects.

#### Examples

```typescript
const action1: Action = {
    // `Vim-style` ctrl + c
    keymap: "<C-c>",
    callback: () => process.exit();
}

const action2: Action = {
    keymap: [ { key: "ctrl", input: "foo" }, { input: "bar" } ],
    callback: () => console.log("<C-foo>bar")
}
```

---

### `Data` interface

The `Data` type represents the parsed stdin buffer in an object.  It can be
destructured from the `parseBuffer` or `InputState.process` functions.


```typescript
type Data = {
    key: PeekSet<Key>;
    input: PeekSet<string>;
    mouse?: {
        x: number;
        y: number;
        leftBtnDown: boolean;
        scrollBtnDown: boolean;
        rightBtnDown: boolean;
        releaseBtn: boolean;
        scrollUp: boolean;
        scrollDown: boolean;
        mousemove: boolean;
    };
    raw: {
        readonly buffer: number[];
        readonly hex: string;
        readonly utf: string;
    };
};
```

>[!NOTE]
>`key` and `input` data are stored in [PeekSet](./PeekSet.md) objects which are
>extended `Set` objects. The reason for this is to make it easier to narrow down
>results.  There exists an `only(...values)` method and the `has` method is
>overriden to allow rest parameters.

##### Ambiguous Keypresses / Why not just store `input` in a string?

Legacy terminals not using the Kitty Protocol send ambiguous keycodes for
certain keypresses.  For example, pressing `Tab` and `Ctrl + i` *both* send
the keycode 9.  Rather than having [parseBuffer](./parseBuffer.md) choose one or
the other, it sends everything.

Other examples include `Ctrl + ' '` and `Ctrl + 2` which also send the same
code.

##### Properties
- `key`: `PeekSet<Key>`
- `input`: `PeekSet<string>`
- `raw`: The buffer repesented in various formats.  For readability, the
  `buffer` property is not of type [Buffer](https://nodejs.org/api/buffer.html),
  but an array representing the keycodes in the buffer (does not use hex
  format).
- `mouse?`: If mouse stdin is detected, this will not be undefined.

---

### configureStdin function

The `configureStdin` function is recommended, but not technically required as
long as you set `process.stdin` to [raw
mode](https://nodejs.org/api/tty.html#readstreamsetrawmodemode).  It is
responsible for setting raw mode and sending CSI
sequences that enable features such as mouse events and the Kitty Extended
Keyboard Protocol.

>[!NOTE]
>configureStdin returns an object containing `kittySupported`, a **getter
>function**.  The operation to query the terminal for kitty support is
>asynchronous, so if you need to check immediately after running configureStdin,
>then it will always be `false`.
>This isn't ideal, but if `kittySupported` returned a Promise, it would likely
>be misused in conditionals (since Promises are truthy) and would require extra
>boilerplate to track the resolved value. This approach tries to minimize misuse
>and reduce boilerplate.






