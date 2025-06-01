import { Decode } from "../helpers/Decode.js";
import { getModifiers } from "../helpers/modifiers.js";
import { KittyKey } from "../maps/KittyMap.js";
import { ShiftMap } from "../maps/ShiftMap.js";
import type { Data, Key } from "../types.js";

export function parseKitty(data: Data) {
    const captures = Decode.getKittyCaptures(data.raw.utf);

    const code = captures[0];
    const char = String.fromCharCode(code);
    const modifiers = getModifiers(captures[1]);

    Object.entries(modifiers).forEach(([key, bool]) => {
        if (bool) data.key.add(key as Key);
    });

    if (!char) return;

    if (modifiers.shift && char in ShiftMap) {
        return data.input.add(ShiftMap[char]);
    }
    if (modifiers.capsLock && code >= 97 && code <= 122) {
        return data.input.add(ShiftMap[char]);
    }
    if (code in KittyKey) {
        return data.key.add(KittyKey[code]);
    }
    if (code <= 255) {
        return data.input.add(char);
    }
    return;
}
