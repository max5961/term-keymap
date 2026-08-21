import type { PeekSet } from "./util/PeekSet.js";
import { Arrays } from "./constants.js";
import type { LEADER } from "./stateful/ActionStore.js";
import type { BaseKeyMapBuilder } from "./util/KeyMapBuilder.js";

export type KeyMap = {
    key?: Key | Key[];
    input?: string;
    leader?: boolean;
};

export type Action = {
    name?: string;
    callback?: () => unknown;
    keymap: KeyMap | KeyMap[] | string | BaseKeyMapBuilder;
};

export type RawKeyMap = KeyMap | typeof LEADER;

/** Action object de-abstracted into its most simple form */
export type RawAction = Omit<Action, "keymap"> & {
    keymap: RawKeyMap[];
};

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
