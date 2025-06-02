import type { Data, Key } from "../types.js";
import type { EnhancedKeyMap } from "./createKeymap.js";
import { CircularQueue } from "./CircularQueue.js";
import { match } from "./match.js";
import { PeekSet } from "../util/PeekSet.js";
import { parseBuffer } from "../parse/parseBuffer.js";

export class InputState {
    private q: CircularQueue<Data>;
    private size: number;

    constructor(size: number = 50) {
        this.size = size;
        this.q = new CircularQueue<Data>(this.size);
    }

    public process = (
        buf: Buffer,
        keymaps: EnhancedKeyMap[],
    ): { keymap?: EnhancedKeyMap; data: Data } => {
        const data = parseBuffer(buf);

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

            const keys = Array.from(data.key.values()) as Key[];
            const onlyModifiers = keys.every((key) => modifiers.has(key));

            if (!onlyModifiers || data.input.size) {
                this.q.enqueue(data);
            }
        }

        // Map containing lengths of keymap sequences. Lengths are sorted so that
        // shorter sequences are prioritized over longer ones.
        const bucket = new Map<number, EnhancedKeyMap[]>();

        keymaps.forEach((km) => {
            const len = km.keymap.length;
            const value = bucket.get(len) ?? [];
            value.push(km);
            bucket.set(len, value);
        });

        const keys = Array.from(bucket.keys()).sort();

        for (const len of keys) {
            const enhancedKeymaps = bucket.get(len);
            if (!enhancedKeymaps) continue;

            for (const ekm of enhancedKeymaps) {
                if (ekm.keymap.length > this.q.size) continue;

                let found = true;
                for (let i = 0; i < ekm.keymap.length; ++i) {
                    const nextKm = ekm.keymap[i];
                    const nextData = this.q.fromTail(ekm.keymap.length - 1 - i);

                    if (!nextKm || !nextData || !match(nextKm, nextData)) {
                        found = false;
                        break;
                    }
                }

                if (found) {
                    ekm.callback?.();
                    this.q.clear();
                    return { data, keymap: ekm };
                }
            }
        }

        return { data };
    };
}
