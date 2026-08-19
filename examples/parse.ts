import { configureStdin, parseBuffer } from "../src/index.js";
import { createCb } from "./util/createCb.js";
import { print } from "./util/prettyPrinter.js";

// `parseBuffer` provides direct stdin parsing when stateful matching provided
// by `InputState` and `ActionStore` isn't needed. It returns a `Data` object
// which contains the parsed info. `Data.key` and `Data.input` are extended Set
// objects with an `only(...values)` method for easier matching.

configureStdin({
    enableMouse: false,
    enableKittyProtocol: true,
});

process.stdin.on("data", (buf: Buffer) => {
    console.clear();

    const data = parseBuffer(buf);

    print(data);

    if (data.key.only("backspace")) {
        createCb("match backspacekey")();
    }
    if (!data.key.size && data.input.only("a")) {
        createCb("match 'a'")();
    }
    if (data.key.only("ctrl") && data.input.only("a")) {
        createCb("match <C-a>")();
    }
    if (data.key.only("ctrl", "alt", "super") && data.input.only("U")) {
        createCb("match <C-A-D-U>")();
    }

    if (data.key.only("ctrl") && data.input.only("c")) {
        process.exit();
    }
});
