import { setMouse } from "./setMouse.js";
import { createRegister } from "./createRegister.js";

process.stdin.setRawMode(true);
setMouse(true, { stream: process.stdin, mode: 3 });

const { parseBuffer, register, data } = createRegister({ size: 2 });

process.stdin.on("data", (buf) => {
    parseBuffer(buf);

    console.clear();
    console.log("raw:", data.raw.buffer.toString());
    console.log("key:", register.key.values());
    console.log("input:", register.input.values());
    console.log("mouse:", data.mouse ?? "-----");

    if (register.key.only("ctrl") && register.input.has("c")) {
        process.exit();
    }
});

console.log("Running...");
