import { parseBuffer } from "../parse/parseBuffer.js";
import type { Data, Key } from "../types.js";
import { PeekSet } from "../util/PeekSet.js";
import type { InputReadyKeyMaps, SafeKeyMapMetaData } from "./createKeymaps.js";
import { match, type KeyMap } from "./match.js";
import type { ShortData } from "./splitAmbiguousData.js";
import { splitAmbiguousData } from "./splitAmbiguousData.js";

/**
 * @constructor @param maxDepth *number*.  Determines the longest possible sequence that
 * can be matched.
 */
export class InputState {
    private maxDepth: number;
    private size: number;
    private root: Node | null;
    private head: Node | null;

    constructor(maxDepth?: number) {
        this.maxDepth = maxDepth ?? 50;
        this.size = 0;
        this.root = null;
        this.head = null;
    }

    private appendData(data: Data) {
        const splitData = splitAmbiguousData(data);
        const node = new Node(splitData);
        ++this.size;

        if (!this.root || !this.head) {
            this.root = node;
            this.head = node;
        } else {
            this.head.next = node;
            node.prev = this.head;
            this.head = node;
        }

        if (this.size > this.maxDepth) {
            this.root = this.root.next;
            if (this.root) {
                this.root.prev = null;
                --this.size;
            }
        }
    }

    public process(
        buf: Buffer,
        keymaps: InputReadyKeyMaps,
    ): { data: Data; keymap?: KeyMap[]; name?: string } {
        const safeKeymaps = keymaps.keymaps;

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
                this.appendData(data);
            } else {
                return { data };
            }
        }

        const bucket: Record<number, SafeKeyMapMetaData[]> = {};

        safeKeymaps.forEach((km) => {
            if (!bucket[km.keymap.length]) bucket[km.keymap.length] = [];
            bucket[km.keymap.length].push(km);
        });

        const lengths = Object.keys(bucket)
            .map((len) => Number(len))
            .sort();

        for (const length of lengths) {
            for (const safekm of bucket[length]) {
                const matched = this.checkMatch(
                    safekm,
                    safekm.keymap.length - 1,
                    this.head,
                );

                if (matched) {
                    this.clear();
                    safekm.callback?.();
                    return {
                        data: data,
                        name: safekm.name,
                        keymap: safekm.keymap,
                    };
                }
            }
        }

        return { data };
    }

    /**
     * Recurses from the last index of node's flattened keymap, and checks if
     * every part of the sequence matches the data history starting at most recent.
     *
     * `node.data.some` because each node.data must be an array in order to store
     * possibilities for ambiguous keycodes that are appended to the data history
     */
    private checkMatch(
        safekm: SafeKeyMapMetaData,
        idx: number,
        node: Node | null,
    ): boolean {
        if (!node) return false;
        if (safekm.keymap.length > this.size) return false;
        if (idx < 0) return false;

        if (node.data.some((d) => match(safekm.keymap[idx], d))) {
            --idx;
            if (idx < 0) {
                return true;
            } else {
                return this.checkMatch(safekm, idx, node.prev);
            }
        }

        return false;
    }

    private clear() {
        this.root = null;
        this.head = null;
        this.size = 0;
    }
}

class Node {
    public prev: null | Node;
    public next: null | Node;
    public data: ShortData[];

    constructor(data: ShortData[]) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}
