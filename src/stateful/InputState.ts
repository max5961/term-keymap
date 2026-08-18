import { parseBuffer } from "../parsers/parseBuffer.js";
import type {
    Action,
    Data,
    Key,
    KeyMap,
    RawAction,
    RawKeyMap,
} from "../types.js";
import { PeekSet } from "../util/PeekSet.js";
import { match } from "./match.js";
import type { ShortData } from "./splitAmbiguousData.js";
import { splitAmbiguousData } from "./splitAmbiguousData.js";
import { LEADER, type ActionStore } from "./ActionStoreRewrite.js";
import { tokenize } from "../tokenize/tokenize.js";
import { expandKeymap } from "./expandKeymap.js";

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

type Opts = {
    maxDepth?: number;
    leader?: KeyMap | KeyMap[] | string;
    leaderTimeout?: number;
};

export class InputState {
    private size: number;
    private root: Node | undefined;
    private head: Node | undefined;
    private leaderTimeoutMode: boolean;
    private leaderTimeoutID: ReturnType<typeof setTimeout> | undefined;
    private readonly maxDepth: number;
    private readonly leader: KeyMap[] | undefined;
    private readonly leaderTimeout: number;
    private readonly resolvedKeymaps: WeakSet<RawAction, KeyMap[]>;

    constructor(opts: Opts = {}) {
        this.maxDepth = opts.maxDepth ?? 50;
        this.leaderTimeout = opts.leaderTimeout ?? 1000;
        if (typeof opts.leader === "string") {
            this.leader = expandKeymap(tokenize(opts.leader));
        } else if (opts.leader) {
            this.leader = expandKeymap(opts.leader);
        }

        this.size = 0;
        this.root = undefined;
        this.head = undefined;
        this.leaderTimeoutMode = false;
        this.leaderTimeoutID = undefined;
        this.resolvedKeymaps = new WeakMap();
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
                this.root.prev = undefined;
                --this.size;
            }
        }
    }

    public clear() {
        this.root = undefined;
        this.head = undefined;
        this.size = 0;
    }

    public process(
        buf: Buffer,
        store: ActionStore,
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

        if (this.leader) {
            const leaderMatch = this.checkMatch(this.leader);

            console.log({ leaderMatch, leader: this.leader });

            if (leaderMatch || this.leaderTimeoutMode) {
                this.startLeaderTimeout(this.leaderTimeout);
            }
        }

        const actions = store._getRawActions();
        return this.checkKeymapMatch(actions, data);
    }

    private checkKeymapMatch(
        actions: RawAction[],
        data: Data,
    ): ReturnType<InputState["process"]> {
        for (let i = 0; i < actions.length; ++i) {
            const action = actions[i];
            const keymap = this.injectLeaderIntoKeymap(action.keymap);

            if (this.checkMatch(keymap)) {
                this.clear();
                return {
                    data: data,
                    name: action.name,
                    keymap: keymap,
                };
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
        keymaps: KeyMap[],
        idx?: number,
        node?: Node | undefined,
    ): boolean {
        idx = idx ?? keymaps.length - 1;
        node = node === undefined ? this.head : node;

        if (node === undefined) return false;
        if (keymaps.length > this.size) return false;
        if (idx < 0) return false;

        if (node.data.some((d) => match(keymaps[idx!], d))) {
            --idx;
            if (idx < 0) {
                return true;
            } else {
                return this.checkMatch(keymaps, idx, node.prev);
            }
        }

        return false;
    }

    private injectLeaderIntoKeymap(raw: RawKeyMap[]): KeyMap[] {
        const result: KeyMap[] = [];
        for (let i = 0; i < raw.length; ++i) {
            const k = raw[i];
            if (k === LEADER) {
                // keymap is invalid since it has a leader but a leader isn't set
                if (!this.leader) return [];
                result.push(...this.leader);
            } else {
                result.push(k);
            }
        }

        // console.log(result);
        return result;
    }

    private startLeaderTimeout(leaderTimeout: number) {
        clearTimeout(this.leaderTimeoutID);

        this.leaderTimeoutMode = true;
        this.leaderTimeoutID = setTimeout(() => {
            this.leaderTimeoutMode = false;
            this.clear();
        }, leaderTimeout);
    }
}

class Node {
    public prev: Node | undefined;
    public next: Node | undefined;
    public data: ShortData[];

    constructor(data: ShortData[]) {
        this.data = data;
        this.prev = undefined;
        this.next = undefined;
    }
}
