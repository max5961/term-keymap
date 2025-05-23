import type PeekSet from "./helpers/PeekSet.js";

export type Key =
    | "ctrl"
    | "alt"
    | "backspace"
    | "delete"
    | "esc"
    | "insert"
    | "return"
    | "sigint"
    | "tab"
    | "up"
    | "down"
    | "left"
    | "right"
    | "f1"
    | "f2"
    | "f3"
    | "f4"
    | "f5"
    | "f6"
    | "f7"
    | "f8"
    | "f9"
    | "f10"
    | "f11"
    | "f12";

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
