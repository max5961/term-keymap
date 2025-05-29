import type { Data, Key } from "../types.js";
import { CircularQueue } from "./CircularQueue.js";
import { match } from "./match.js";
import type { EnhancedKeyMap } from "./createKeymap.js";
import PeekSet from "../helpers/PeekSet.js";

export function history() {
    const q = new CircularQueue<Data>(50);

    const checkMatch = (
        keymaps: EnhancedKeyMap[],
        data: Data,
    ): string | undefined => {
        if (data.key.size || data.input.size) {
            const modifiers = new PeekSet<Key>([
                "shift",
                "alt",
                "ctrl",
                "super",
                "hyper",
                "meta",
                "capsLock",
                "numLock",
            ]);

            let onlyModifiers = true;
            for (const key of data.key) {
                if (!modifiers.has(key)) {
                    onlyModifiers = false;
                    break;
                }
            }

            if (!onlyModifiers || data.input.size) {
                q.enqueue(data);
            }
        }

        // Map of containing lengths so that shorter sequences can be checked first
        const bucket = new Map<number, EnhancedKeyMap[]>();

        keymaps.forEach((km) => {
            const len = km.keymap.length;
            const value = bucket.get(len) ?? [];
            value.push(km);
            bucket.set(len, value);
        });

        const keys = Array.from(bucket.keys());

        for (const len of keys) {
            const enhancedKeymaps = bucket.get(len);
            if (!enhancedKeymaps) continue;

            for (const ekm of enhancedKeymaps) {
                if (ekm.keymap.length > q.size) continue;

                let found = true;
                q.forEach((data, i) => {
                    const nextKm = ekm.keymap[len - 1 - i];
                    if (nextKm && !match(nextKm, data)) {
                        found = false;
                    }
                });

                if (found) {
                    ekm.callback?.();
                    q.clear();
                    return ekm.name;
                }
            }
        }

        return;
    };

    return { checkMatch };
}
