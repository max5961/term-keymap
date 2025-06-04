import type { Data, Key } from "../types.js";
import type { EnhancedKeyMap } from "./createKeymap.js";
import type { KeyMap } from "./match.js";
import { match } from "./match.js";
import { parseBuffer } from "../parse/parseBuffer.js";
import { PeekSet } from "../util/PeekSet.js";
import { splitAmbiguousData, type ShortData } from "./splitAmbiguousData.js";

export class InputTree {
    private maxDepth: number;
    private depth: number;
    private firstChildren: Node[];
    private leafs: Node[];

    constructor(maxDepth: number) {
        this.maxDepth = maxDepth;
        this.depth = 0;
        this.firstChildren = [];
        this.leafs = [];
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
                for (const leaf of this.leafs) {
                    const matched = this.checkMatch(
                        ekm,
                        ekm.keymap.length - 1,
                        leaf,
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
        }

        return { data };
    }

    private checkMatch(
        ekm: EnhancedKeyMap,
        idx: number,
        curr: Node | null,
    ): boolean {
        if (idx < 0 || idx > this.depth || curr === null) return false;

        if (match(ekm.keymap[idx--], curr.data)) {
            if (idx < 0) {
                return true;
            } else {
                return this.checkMatch(ekm, idx, curr.prev);
            }
        }

        return false;
    }

    private appendData(data: Data): void {
        // Split data into ShortData[]
        const splitData = splitAmbiguousData(data);
        const isAmbigData = splitData.length > 1;

        // Get the possible invalid sets
        const invalid = !isAmbigData
            ? new Set<string>()
            : splitData.reduce((a: Set<string>, c: ShortData) => {
                  const stringified = this.stringifyAmbig(c);
                  a.add(stringified);
                  return a;
              }, new Set<string>());

        // Create the nodes, each having a unique invalid set from the other in the
        // splitData
        const nextLeafs = splitData.map((data) => {
            const uniqueInvalid = new Set(invalid);
            let pathId = "";
            if (isAmbigData) {
                pathId = this.stringifyAmbig(data);
                uniqueInvalid.delete(pathId);
            }
            return new Node(data, uniqueInvalid, pathId);
        });

        // Append the next leaf nodes.  If the Q is empty, we can just replace
        // the firstChildren and leafs
        if (!this.firstChildren.length && !this.leafs.length) {
            this.firstChildren = nextLeafs;
            this.leafs = nextLeafs;

            for (const leaf of this.leafs) {
                leaf.prev = null;
            }
            ++this.depth;
        }

        // Q is not empty
        else if (this.firstChildren.length && this.leafs.length) {
            const prevLeafs = this.leafs;

            for (const prevLeaf of prevLeafs) {
                for (const nextLeaf of nextLeafs) {
                    prevLeaf.tryAppendChild(nextLeaf);
                }
            }

            this.leafs = nextLeafs;
            ++this.depth;
        }

        // Resize if too deep
        if (this.depth > this.maxDepth) {
            const nextFirstChildren: Node[] = [];

            for (const child of this.firstChildren) {
                child.next.forEach((nextChild) => {
                    nextChild.prev = null;
                    nextFirstChildren.push(nextChild);
                });
            }

            this.firstChildren = nextFirstChildren;
            --this.depth;
        }
    }

    public clear() {
        this.firstChildren = [];
        this.leafs = [];
        this.depth = 0;
    }

    private stringifyAmbig(shortData: ShortData): string {
        const append = (set: PeekSet) => {
            Array.from(set.values())
                .sort()
                .forEach((v) => (invalidAmbig += v));
        };

        let invalidAmbig = "k:";
        append(shortData.key);
        invalidAmbig += ":i:";
        append(shortData.input);

        return invalidAmbig;
    }
}

class Node {
    public prev: Node | null;
    public next: Node[];
    public data: ShortData;
    public invalid: Set<string>;
    public pathId: string;

    constructor(data: ShortData, invalid: Set<string>, pathId: string) {
        this.data = data;
        this.invalid = invalid;
        this.pathId = pathId;
        this.prev = null;
        this.next = [];
    }

    /**
     * Ensures that:
     * - nodes that are not on this Node's path are not appended
     * - child nodes inherit this Node's invalid set
     * - sets the parent of the child to this Node
     */
    public tryAppendChild(node: Node): boolean {
        if (node.pathId && this.invalid.has(node.pathId)) return false;

        for (const value of this.invalid) {
            node.invalid.add(value);
        }
        this.next.push(node);
        node.prev = this;
        return true;
    }
}
