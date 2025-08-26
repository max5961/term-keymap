import { parseBuffer } from "../parsers/parseBuffer.js";
import type { Data, Key, KeyMap } from "../types.js";
import { PeekSet } from "../util/PeekSet.js";
import { match } from "./match.js";
import type { ShortData } from "./splitAmbiguousData.js";
import { splitAmbiguousData } from "./splitAmbiguousData.js";
import { UserConfig, type SanitizedAction } from "./UserConfig.js";

const Modifiers = new PeekSet<Key>([
    "ctrl",
    "alt",
    "super",
    "meta",
    "hyper",
    "capsLock",
    "numLock",
    "shift",
]);

export class InputState {
    private maxDepth: number;
    private size: number;
    private root: Node | null;
    private head: Node | null;
    private leaderTimeoutMode: boolean;
    private leaderTimeoutID: ReturnType<typeof setTimeout> | undefined;

    constructor(
        opts: {
            maxDepth?: number;
            leader?: Key | string;
            leaderTimeout?: number;
        } = {},
    ) {
        this.maxDepth = opts.maxDepth ?? 50;
        this.size = 0;
        this.root = null;
        this.head = null;
        this.leaderTimeoutMode = false;
        this.leaderTimeoutID = undefined;
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

    public removeFromHead() {
        if (!this.root || !this.head) return;

        this.head = this.head.prev;
        if (this.head && this.head.next) {
            this.head.next = null;
        }
    }

    public process(
        buf: Buffer,
        config: UserConfig,
    ): { data: Data; keymap?: KeyMap[]; name?: string } {
        const data = parseBuffer(buf);

        if (!data.key.size && !data.input.size) {
            return { data };
        }

        const onlyMods = Array.from(data.key.values()).every((key) =>
            Modifiers.has(key),
        );

        if (onlyMods && !data.input.size) {
            return { data };
        }

        this.appendData(data);

        if (config.leader) {
            const leaderMatch = this.checkMatch({ keymap: config.leader });

            if (leaderMatch || this.leaderTimeoutMode) {
                this.startLeaderTimeout(config.leaderTimeout);
            }
        }

        return this.checkKeymapMatch(config, data);
    }

    private checkKeymapMatch(
        config: UserConfig,
        data: Data,
    ): ReturnType<InputState["process"]> {
        const bucket: Record<number, SanitizedAction[]> = {};

        config.actions.forEach((action) => {
            if (!bucket[action.keymap.length]) {
                bucket[action.keymap.length] = [];
            }
            bucket[action.keymap.length].push(action);
        });

        const lengths = Object.keys(bucket)
            .map((len) => Number(len))
            .sort();

        let lastMatch: ReturnType<InputState["process"]> | undefined;
        for (const length of lengths) {
            if (lastMatch) break;

            for (const action of bucket[length]) {
                const matched = this.checkMatch(action);

                if (matched) {
                    action.callback?.();

                    lastMatch = {
                        data: data,
                        name: action.name,
                        keymap: action.keymap,
                    };
                }
            }
        }

        if (lastMatch) {
            this.clear();
        }

        return lastMatch || { data };
    }

    /**
     * Recurses from the last index of node's flattened keymap, and checks if
     * every part of the sequence matches the data history starting at most recent.
     *
     * `node.data.some` because each node.data must be an array in order to store
     * possibilities for ambiguous keycodes that are appended to the data history
     */
    private checkMatch(
        action: SanitizedAction,
        idx?: number,
        node?: Node | null,
    ): boolean {
        idx = idx ?? action.keymap.length - 1;
        node = node === undefined ? this.head : node;

        if (node === null) return false;
        if (action.keymap.length > this.size) return false;
        if (idx < 0) return false;

        if (node.data.some((d) => match(action.keymap[idx!], d))) {
            --idx;
            if (idx < 0) {
                return true;
            } else {
                return this.checkMatch(action, idx, node.prev);
            }
        }

        return false;
    }

    private startLeaderTimeout(leaderTimeout: number) {
        clearTimeout(this.leaderTimeoutID);

        this.leaderTimeoutMode = true;
        this.leaderTimeoutID = setTimeout(() => {
            this.leaderTimeoutMode = false;
            this.clear();
        }, leaderTimeout);
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
