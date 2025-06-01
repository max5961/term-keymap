import { Decode } from "../helpers/Decode.js";
import { getModifiers } from "../helpers/modifiers.js";
import { CsiChars } from "../maps/CsiChars.js";
import { LegacyKeys } from "../maps/LegacyKeys.js";
import { TildeKeys } from "../maps/TildeKeys.js";
import type { Data, Key } from "../types.js";

export function parseLegacy(data: Data) {
    if (data.raw.utf in LegacyKeys) {
        data.key.add(LegacyKeys[data.raw.utf]);
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

    if (code === 1) {
        const key = CsiChars[letter];
        if (key) data.key.add(key);
        return;
    }

    if (code in TildeKeys && letter === "~") {
        const fkey = TildeKeys[code];
        data.key.add(fkey);
        return;
    }

    return;
}
