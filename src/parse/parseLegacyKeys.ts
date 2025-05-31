import { LegacyKeys } from "../maps/LegacyKeys.js";
import type { Data } from "../types.js";

export function parseLegacyKeys(data: Data): void {
    if (LegacyKeys[data.raw.utf]) {
        LegacyKeys[data.raw.utf].forEach((k) => data.key.add(k));
    }
}
