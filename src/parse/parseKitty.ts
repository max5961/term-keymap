import type { Data, Key } from "../types.js";
import { Decode } from "../util/Decode.js";
import { getModifiers } from "../util/getModifiers.js";
import { KittyKey } from "../maps/KittyMap.js";
import { ShiftMap } from "../maps/ShiftMap.js";
import { KittyNumLockMap } from "../maps/KittyNumLockMap.js";

export function parseKitty(data: Data): void {
    const captures = Decode.getKittyCaptures(data.raw.utf);

    const code = captures[0];
    const char = String.fromCharCode(code);
    const modifiers = getModifiers(captures[1]);

    Object.entries(modifiers).forEach(([key, bool]) => {
        if (bool) data.key.add(key as Key);
    });

    if (!char) return;

    if (code in KittyNumLockMap) {
        data.input.add(KittyNumLockMap[code]);
        return;
    }

    if (modifiers.shift && char in ShiftMap) {
        data.input.add(ShiftMap[char]);
        return;
    }
    if (modifiers.capsLock && code >= 97 && code <= 122) {
        data.input.add(ShiftMap[char]);
        return;
    }
    if (code in KittyKey) {
        data.key.add(KittyKey[code]);
        return;
    }
    if (code <= 255) {
        data.input.add(char);
        return;
    }
    return;
}
