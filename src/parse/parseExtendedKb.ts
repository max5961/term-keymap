import { KittyKey } from "../maps/KittyMap.js";
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

export function parseExtendedKb(data: Data): void {
    const regex = /^\[(\d+);(\d+)(\w+)/gm;
    const regexResults = regex.exec(data.raw.utf.slice(1));
    const matches = regexResults
        ? Array.from(regexResults)
              .slice(1)
              .map((m) => Number(m))
        : null;

    console.log({ matches });

    if (matches && matches.length === 3) {
        const char = String.fromCharCode(Number(matches[0]));
        const modifier = matches[1] - 1;

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

        const byte = [
            modifier & Map.numLock,
            modifier & Map.capsLock,
            modifier & Map.meta,
            modifier & Map.hyper,
            modifier & Map.super,
            modifier & Map.ctrl,
            modifier & Map.alt,
            modifier & Map.shift,
        ];

        if (map.ctrl && char === "c") process.exit();
        console.log({ map, modifier, char, byte });
        console.log("-");
    } else if (matches && matches[0] !== undefined) {
        if (matches[0] in KittyKey) {
            data.key.add(KittyKey[matches[0]]);
        }
    }
}
