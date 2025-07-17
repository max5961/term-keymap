import type { PeekSet } from "./util/PeekSet.js";
import { Arrays } from "./constants.js";

export type KeyMap = {
    key?: Key | Key[];
    input?: string;
    leader?: boolean;
};

export type Action = {
    keymap: KeyMap | KeyMap[] | string;
    name?: string;
    callback?: () => unknown;
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
