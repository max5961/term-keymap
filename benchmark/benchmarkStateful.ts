import child_process from "node:child_process";
import fs from "node:fs";
import { ActionStore, InputState, key } from "../src/index.js";

const ITER = Number(process.argv[2]);
if (!Number.isInteger(ITER)) throw new Error("provide a number argument");

const fileLines: string[] = [];
const store = new ActionStore();
const inputState = new InputState();

// ----- ADD ACTIONS TO ACTIONSTORE -----

const startStore = performance.now();
for (let i = ITER; i >= 0; --i) {
    store.addAction({
        keymap: { key: "ctrl", input: `${i}` },
        // keymap: `<C-${i}>`,
        // keymap: key.ctrl.input(`${i}`),
    });
}
const endStore = performance.now();

fileLines.push(`ActionStore.addAction total: ${endStore - startStore}`);
fileLines.push(
    `ActionStore.addAction individual: ${(endStore - startStore) / ITER}`,
);

// ----- GET RAW ACTIONS FROM ACTION STOR -----

const startGetRaw = performance.now();
const actions = store._getRawActions();
const endGetRaw = performance.now();

fileLines.push(`ActionStore._getRawActions total: ${endGetRaw - startGetRaw}`);
fileLines.push(
    `ActionStore._getRawActions individual: ${(endGetRaw - startGetRaw) / ITER}`,
);

// ----- PROCESS ACTIONS WITH INPUTSTATE -----

const stdin = Buffer.from([1]);
const startProcess = performance.now();
for (let i = 0; i < ITER; ++i) {
    inputState.process(stdin, store);
}
const endProcess = performance.now();

fileLines.push(
    `InputState.process ${ITER} actions ${ITER} times: ${endProcess - startProcess}`,
);
fileLines.push(
    `InputState.process ${ITER} actions ${(endProcess - startProcess) / ITER}`,
);

const gitBranchCommand = child_process.spawnSync(
    "git",
    ["branch", "--show-current"],
    {
        encoding: "utf8",
    },
);

fileLines.unshift(`On branch ${gitBranchCommand.stdout.trimEnd()}`);

const gitHashCommand = child_process.spawnSync(
    "git",
    ["rev-parse", "--short", "HEAD"],
    { encoding: "utf8" },
);
fileLines.unshift(`Commit: ${gitHashCommand.stdout.trimEnd()}`);
fileLines.push("-".repeat(80) + "\n");

const fileContents = fileLines.join("\n");
console.log(fileContents);
fs.appendFileSync("./benchmark-stateful.log", fileContents, "utf8");
