import { CsiRegex } from "../helpers/CsiRegex.js";
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
    const key: Key[] =
        seq[1] === 5
            ? ["ctrl"]
            : seq[1] === 3
              ? ["alt"]
              : seq[1] === 7
                ? ["ctrl", "alt"]
                : [];
    key.forEach((k) => data.key.add(k));

    if (seq[0] === 1) {
        const key = CsiChars[letter];
        if (key) data.key.add(key);
    } else if (seq[0] in TildeKeys && letter === "~") {
        const fkey = TildeKeys[seq[0] as number];
        if (fkey) data.key.add(fkey);
    }

    return true;
}
