import { parseBuffer } from "../parse/parseBuffer.js";
import type { Data, Key } from "../types.js";
import { PeekSet } from "../util/PeekSet.js";
import type { EnhancedKeyMap } from "./createKeymap.js";
import { match, type KeyMap } from "./match.js";
import type { ShortData } from "./splitAmbiguousData.js";
import { splitAmbiguousData } from "./splitAmbiguousData.js";

export class InputState {
    private maxDepth: number;
    private size: number;
    private root: Node | null;
    private head: Node | null;

    constructor(maxDepth: number) {
        this.maxDepth = maxDepth;
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
        keymaps: EnhancedKeyMap[],
    ): { data: Data; keymap?: KeyMap[]; name?: string } {
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

        const bucket: Record<number, EnhancedKeyMap[]> = {};

        keymaps.forEach((km) => {
            if (!bucket[km.keymap.length]) bucket[km.keymap.length] = [];
            bucket[km.keymap.length].push(km);
        });

        const lengths = Object.keys(bucket)
            .map((len) => Number(len))
            .sort();

        for (const length of lengths) {
            for (const ekm of bucket[length]) {
                const matched = this.checkMatch(
                    ekm,
                    ekm.keymap.length - 1,
                    this.head,
                );

                if (matched) {
                    this.clear();
                    ekm.callback?.();
                    return {
                        data: data,
                        name: ekm.name,
                        keymap: ekm.keymap,
                    };
                }
            }
        }

        return { data };
    }

    private checkMatch(
        ekm: EnhancedKeyMap,
        idx: number,
        node: Node | null,
    ): boolean {
        if (!node) return false;
        if (ekm.keymap.length > this.size) return false;
        if (idx < 0) return false;

        if (node.data.some((d) => match(ekm.keymap[idx], d))) {
            --idx;
            if (idx < 0) {
                return true;
            } else {
                return this.checkMatch(ekm, idx, node.prev);
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
