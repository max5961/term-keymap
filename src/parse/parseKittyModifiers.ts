import type { Data } from "../types.js";

const Map = {
    shift: 1,
    alt: 2,
    ctrl: 4,
    super: 8,
    hyper: 16,
    meta: 32,
    capsLock: 64,
    numLock: 128,
};

export function parseKittyLayout(data: Data): void {
    const regex = /^\[(\d+);(\d+)(\w+)/gm;
    const regexResults = regex.exec(data.raw.utf.slice(1));
    const matches = regexResults
        ? Array.from(regexResults)
              .slice(1)
              .map((m) => Number(m))
        : null;

    if (matches && matches.length === 3) {
        const char = String.fromCharCode(Number(matches[0]));
        const modifier = matches[1];

        console.log({ modifier });

        const map = {
            shift: (modifier & Map.shift) !== 0,
            alt: (modifier & Map.alt) !== 0,
            ctrl: (modifier & Map.ctrl) !== 0,
            super: (modifier & Map.super) !== 0,
            hyper: (modifier & Map.hyper) !== 0,
            meta: (modifier & Map.meta) !== 0,
            capsLock: (modifier & Map.capsLock) !== 0,
            numLock: (modifier & Map.numLock) !== 0,
        };

        console.log({ char, map });
        console.log("-".repeat(process.stdout.columns));
    }
}
