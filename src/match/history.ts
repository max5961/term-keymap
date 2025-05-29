import type { Data } from "../types.js";
import { CircularQueue } from "./CircularQueue.js";
import { match, type KeyMap } from "./match.js";
import { normalizeKeymap } from "./normalizeKeymap.js";

export function history() {
    const q = new CircularQueue<Data>(50);

    const update = (data: Data) => {
        if (data.key.size || data.input.size) {
            q.enqueue(data);
        }
    };

    const checkMatch = (
        keymaps: (KeyMap | KeyMap[])[],
    ): KeyMap | KeyMap[] | undefined => {
        // Map of containing lengths so that shorter sequences can be checked first
        const bucketMap: Record<number, KeyMap[][]> = {};

        keymaps.forEach((kmOrSeq) => {
            const normalized = normalizeKeymap(kmOrSeq);
            const len = normalized.length;
            if (!bucketMap[len]) bucketMap[len] = [];
            bucketMap[len].push(normalized);
        });

        const sortedKeys = Object.keys(bucketMap)
            .sort()
            .map((s) => Number(s));

        for (const key of sortedKeys) {
            const sequences = bucketMap[key];

            for (const seq of sequences) {
                if (seq.length > q.size) continue;

                let found = true;
                for (let i = seq.length - 1; i >= 0; --i) {
                    if (!q.fromTail(i) || !match(seq[i], q.fromTail(i)!)) {
                        found = false;
                        break;
                    }
                }

                if (found) {
                    q.clear();
                    return seq;
                }
            }
        }

        return;
    };

    return { update, checkMatch };
}
