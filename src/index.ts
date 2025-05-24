import { setMouse } from "./setMouse.js";
import { createRegister } from "./createRegister.js";
import type { Key } from "./types.js";
import { isExtendedLayout } from "./helpers/isExtendedLayout.js";

process.stdin.setRawMode(true);
setMouse(true, { stream: process.stdin, mode: 3 });

const { parseBuffer, register, data } = createRegister({ size: 2 });

function dispatchEvent() {
    const events = [
        { key: "ctrl", input: "dd", cb: () => console.log("event!!!") },
    ];

    events.forEach((e) => {
        if (register.key.only(e.key as Key) && register.input.only(e.input)) {
            e.cb();
        }
    });
}

// process.stdout.write("\x1b[>1u");
// process.stdout.write("\x1b[>8u");
process.on("exit", () => process.stdout.write("\x1b[<u"));

isExtendedLayout().then(console.log);
//
// process.stdin.on("data", (buf) => {
//     console.clear();
//     parseBuffer(buf);
//
//     console.log("raw bytes:", data.raw.buffer.toString());
//     console.log("raw utf:", data.raw.utf);
//     console.log("key:", register.key.values());
//     console.log("input:", register.input.values());
//     console.log("mouse:", data.mouse ?? "-----");
//
//     console.log("-".repeat(process.stdout.columns));
//     console.log("data:", data);
//
//     if (register.key.only("ctrl") && register.input.has("c")) {
//         process.exit();
//     }
//
//     if (register.input.has("qq")) process.exit();
//
//     dispatchEvent();
// });
//
// console.clear();
// console.log("Type something or move the mouse...");
