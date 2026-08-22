import type { PeekSet } from "./util/PeekSet.js";
import { Arrays, INVALID_ACTION, LEADER } from "./constants.js";
import type {
    KeyMapBuilder,
    LeaderKeyMapBuilder,
} from "./util/KeyMapBuilder.js";

export type KeyMap = {
    key?: Key | Key[];
    input?: string;
    leader?: boolean;
};

export type Action = {
    name?: string;
    callback?: () => unknown;
    keymap: KeyMap | KeyMap[] | string | KeyMapBuilder | LeaderKeyMapBuilder;
};

export type RawKeyMap = KeyMap | typeof LEADER;
export type ExpandedRawKeyMap = RawKeyMap[];
export type ExpandedKeyMap = KeyMap[];
export type ExpandedAction = Action & {
    keymap: ExpandedKeyMap;
};
export type RawAction = Action | typeof INVALID_ACTION;

export type LeaderKeyMap = KeyMap | KeyMap[] | string | KeyMapBuilder;

export type Modifier = (typeof Arrays.Modifiers)[number];
export type Key = Modifier | (typeof Arrays.Keys)[number];

export type Data = {
    key: PeekSet<Key>;
    input: PeekSet<string>;
    mouse?: {
        x: number;
        y: number;
        leftBtnDown: boolean;
        scrollBtnDown: boolean;
        rightBtnDown: boolean;
        releaseBtn: boolean;
        scrollUp: boolean;
        scrollDown: boolean;
        mousemove: boolean;
    };
    raw: {
        readonly buffer: number[];
        readonly hex: string;
        readonly utf: string;
    };
};
