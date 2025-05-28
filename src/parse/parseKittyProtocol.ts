import { CsiRegex } from "../helpers/CsiRegex.js";
import { KittyKey } from "../maps/KittyMap.js";
import { ShiftMap } from "../maps/ShiftMap.js";
import type { Data, Key } from "../types.js";

const BitWiseMap = {
    shift: 1,
    alt: 2,
    ctrl: 4,
    super: 8,
    hyper: 16,
    meta: 32,
    capsLock: 64,
    numLock: 128,
} as const;

export function parseKittyProtocol(data: Data): void {
    const withMods = CsiRegex.getKittyCharWithMod(data.raw.utf);
    const withoutMods = CsiRegex.getKittyChar(data.raw.utf);

    const matches = Array.from(withMods ?? withoutMods ?? [])
        .slice(1)
        .map((m) => Number(m));

    const charCode = matches[0];
    const char = String.fromCharCode(charCode);
    const modifier = (matches[1] ?? 1) - 1;
    let shift = false;

    // This is a modifier sequence
    if (modifier) {
        const map: Partial<Record<Key | "shift", boolean>> = {
            shift: (modifier & BitWiseMap.shift) !== 0,
            alt: (modifier & BitWiseMap.alt) !== 0,
            ctrl: (modifier & BitWiseMap.ctrl) !== 0,
            super: (modifier & BitWiseMap.super) !== 0,
            hyper: (modifier & BitWiseMap.hyper) !== 0,
            meta: (modifier & BitWiseMap.meta) !== 0,

            /* These just make using the parsed data more complicated and dont offer much */
            // capsLock: (modifier & BitWiseMap.capsLock) !== 0,
            // numLock: (modifier & BitWiseMap.numLock) !== 0,
        } as const;

        Object.entries(map).forEach(([key, bool]) => {
            if (bool) {
                if (key !== "shift" || charCode in KittyKey)
                    data.key.add(key as Key);
            }
        });

        shift = !!map.shift;
    }

    if (char) {
        if (shift && char in ShiftMap) {
            data.input.add(ShiftMap[char as keyof typeof ShiftMap]);
        } else if (charCode in KittyKey) {
            data.key.add(KittyKey[charCode]);
        } else {
            data.input.add(char);
        }
    }
}
