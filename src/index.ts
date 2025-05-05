import { ReadStdin } from "./ReadStdin.js";

process.stdin.setRawMode(true);

const read = new ReadStdin();

read.setMouse(1);
// process.stdout.write("\x1b[?1003h");

read.listen();

read.on("data", (data) => {
    console.log(`\n${"\x1b[34m-\x1b[0m".repeat(process.stdout.columns)}\n`);

    console.log(data);

    if (data.buffer[0] === 3) process.exit();
});

console.log("Running...");
