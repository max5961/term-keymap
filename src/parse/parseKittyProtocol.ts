import { CsiRegex } from "../helpers/CsiRegex.js";
import { getModifiers } from "../helpers/modifiers.js";
import { KittyKey } from "../maps/KittyMap.js";
import { LegacyKeys } from "../maps/LegacyKeys.js";
import { ShiftMap } from "../maps/ShiftMap.js";
import type { Data, Key } from "../types.js";
import { parseLegacyKeys } from "./parseLegacyKeys.js";

export function parseKittyProtocol(data: Data): void {
    const withMods = CsiRegex.getKittyCharWithMod(data.raw.utf);
    const withoutMods = CsiRegex.getKittyChar(data.raw.utf);

    const matches = Array.from(withMods ?? withoutMods ?? [])
        .slice(1)
        .map((m) => Number(m));

    const charCode = matches[0];
    const char = String.fromCharCode(charCode);
    let shift = false;

    const modifiers = getModifiers(matches[1]);
    Object.entries(modifiers).forEach(([key, bool]) => {
        if (bool) {
            if (key !== "shift" || charCode in KittyKey)
                data.key.add(key as Key);
        }
    });
    shift = !!modifiers.shift;

    if (char) {
        if (shift && char in ShiftMap) {
            data.input.add(ShiftMap[char as keyof typeof ShiftMap]);
        } else if (modifiers.capsLock && charCode >= 97 && charCode <= 122) {
            data.input.add(ShiftMap[char as keyof typeof ShiftMap]);
        } else if (charCode in KittyKey) {
            data.key.add(KittyKey[charCode]);
        } else if (data.raw.utf in LegacyKeys) {
            parseLegacyKeys(data);
        } else if (charCode < 255) {
            data.input.add(char);
        }
    }
}
