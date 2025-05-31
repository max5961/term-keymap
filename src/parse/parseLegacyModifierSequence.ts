import { CsiRegex } from "../helpers/CsiRegex.js";
import { getModifiers } from "../helpers/modifiers.js";
import { CsiChars } from "../maps/CsiChars.js";
import { TildeKeys } from "../maps/TildeKeys.js";
import type { Data, Key } from "../types.js";

export function parseLegacyModifierSequence(data: Data): boolean {
    const results = CsiRegex.getLegacyModifierSequence(data.raw.utf);
    if (!results) return false;

    const seq = results.slice(1).map((v) => {
        if (Number.isNaN(Number(v))) {
            return v;
        } else {
            return Number(v);
        }
    });

    const letter = seq[2] as string;
    const mods = getModifiers(Number(seq[1] ?? 1));
    Object.entries(mods).forEach(([key, bool]) => {
        if (bool) {
            data.key.add(key as Key);
        }
    });

    if (seq[0] === 1) {
        const key = CsiChars[letter];
        if (key) data.key.add(key);
    } else if (seq[0] in TildeKeys && letter === "~") {
        const fkey = TildeKeys[seq[0] as number];
        if (fkey) data.key.add(fkey);
    }

    return true;
}
