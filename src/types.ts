import type { PeekSet } from "./util/PeekSet.js";

export type Modifier = "ctrl" | "alt" | "shift" | "super" | "hyper" | "meta";

export type Key =
    | Modifier

    // capsLock & numLock are technically modifiers since they modify the kitty
    // modifier bit, but aren't typically used in combination with other keys
    | "capsLock"
    | "numLock"
    | "backspace"
    | "delete"
    | "esc"
    | "insert"
    | "return"
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
    | "scrollLock"
    | "printScreen"
    | "begin"
    | "pause"
    | "menu"
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
    | "mediaMuteVolume";

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
