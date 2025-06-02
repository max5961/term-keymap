import { Decode } from "../util/Decode.js";
import { getModifiers } from "../util/modifiers.js";
import { LegacyKeyMap } from "../maps/LegacyKeyMap.js";
import { LetterMap } from "../maps/LetterMap.js";
import { TildeMap } from "../maps/TildeMap.js";
import type { Data, Key } from "../types.js";

export function parseLegacy(data: Data): void {
    if (data.raw.utf in LegacyKeyMap) {
        data.key.add(LegacyKeyMap[data.raw.utf]);
        return;
    }

    /**
     * Captures can only be from CSI number ; modifier {~ABCDEHFPQRS} since the
     * others will have been found in LegacyKey map
     */
    const captures = Decode.getLegacyCaptures(data.raw.utf);

    const code = Number(captures[0]);
    const modifier = Number(captures[1]);
    const letter = captures[2];

    const mods = getModifiers(modifier);
    Object.entries(mods).forEach(([key, bool]) => {
        if (bool) data.key.add(key as Key);
    });

    if (code === 1 && letter in LetterMap) {
        const key = LetterMap[letter];
        data.key.add(key);
        return;
    }

    if (letter === "~" && code in TildeMap) {
        const fkey = TildeMap[code];
        data.key.add(fkey);
        return;
    }

    return;
}
