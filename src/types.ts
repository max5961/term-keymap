import type PeekSet from "./helpers/PeekSet.js";

export type Key =
    | "ctrl"
    | "alt"
    | "super"
    | "hyper"
    | "meta"
    | "capsLock"
    | "numLock"
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
    | "f12"
    | "f13"
    | "f14"
    | "f15"
    | "f16"
    | "f17"
    | "f18"
    | "f19"
    | "f20"
    | "f21"
    | "f22"
    | "f23"
    | "f24"
    | "f25"
    | "f26"
    | "f27"
    | "f28"
    | "f29"
    | "f30"
    | "f31"
    | "f32"
    | "f33"
    | "f34"
    | "f35"
    | "pageUp"
    | "pageDown"
    | "home"
    | "end"
    | "insert"
    | "delete"
    | "begin"
    | "mediaPlay"
    | "mediaPause"
    | "mediaPlayPause"
    | "mediaReverse"
    | "mediaStop"
    | "mediaFastForward"
    | "mediaRewind"
    | "mediaTrackNext"
    | "mediaTrackPrevious"
    | "mediaRecord"
    | "mediaLowerVolume"
    | "mediaRaiseVolume"
    | "mediaMuteVolume"
    | "shift"
    | "ctrl"
    | "alt"
    | "super"
    | "hyper"
    | "meta"
    | "shift"
    | "ctrl"
    | "alt"
    | "super"
    | "hyper"
    | "meta"
    | "shift"
    | "shift";

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
