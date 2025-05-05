import { ReadStdin } from "./ReadStdin.js";

process.stdin.setRawMode(true);

const read = new ReadStdin();

read.listen();
read.setMouse(1);

read.on("data", (data) => {
    console.log(`\n${"\x1b[34m-\x1b[0m".repeat(process.stdout.columns)}\n`);

    let bufnums = "";
    for (let i = 0; i < data.buffer.length; ++i) {
        bufnums += data.buffer[i];
        bufnums += ", ";
    }
    console.log("BUFFER: ", bufnums, "\n");
    console.log(data);

    if (data.buffer[0] === 3) process.exit();
});

console.log("Running...");
