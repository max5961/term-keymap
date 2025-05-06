import { createRegister } from "./createRegister.js";
import { setMouse } from "./setMouse.js";
import { ReadStdin } from "./ReadStdin.js";

process.stdin.setRawMode(true);

// const read = new ReadStdin();
//
// read.listen();
// read.setMouse(1);
//
// read.on("data", (data) => {
//     console.log(`\n${"\x1b[34m-\x1b[0m".repeat(process.stdout.columns)}\n`);
//
//     let bufnums = "";
//     for (let i = 0; i < data.raw.buffer.length; ++i) {
//         bufnums += data.raw.buffer[i];
//         bufnums += ", ";
//     }
//     console.log("BUFFER: ", bufnums, "\n");
//     console.log({ ...data, defaultInput: data.defaultInput });
//
//     if (data.key.ctrl && data.defaultInput === "c") process.exit();
// });

const { parseBuffer, register, data } = createRegister({ size: 3 });
setMouse(3);

process.stdin.on("data", (buf) => {
    parseBuffer(buf);

    console.log({ key: register.key, input: register.defaultInput });
    console.log({ mouse: data.mouse });
    console.log(data);

    if (register.key.has("ctrl") && register.input.has("c")) process.exit();
});

console.log("Running...");
