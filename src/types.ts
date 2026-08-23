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

export type MouseData = Exclude<Data["mouse"], undefined>;

export type MouseEventType =
    // LEFT BTN
    | "click"
    | "dblclick"
    | "mousedown"
    | "mouseup"

    // RIGHT BTN
    | "rightclick"
    | "rightdblclick"
    | "rightmousedown"
    | "rightmouseup"

    // SCROLL WHEEL
    | "scrollup"
    | "scrolldown"
    | "scrollclick"
    | "scrolldblclick"
    | "scrollbtndown"
    | "scrollbtnup"

    // MOVEMENT
    | "mousemove"
    | "drag"
    | "dragstart"
    | "dragend";

interface IMouseEvent<T extends MouseEventType = any> {
    type: T;
    clientX: number;
    clientY: number;
}

interface IDragMouseEvent<T extends MouseEventType = any>
    extends IMouseEvent<T> {
    dragStartX: number;
    dragStartY: number;
}

type MouseEventMap = {
    click: IMouseEvent<"click">;
    dblclick: IMouseEvent<"dblclick">;
    mousedown: IMouseEvent<"mousedown">;
    mouseup: IMouseEvent<"mouseup">;
    rightclick: IMouseEvent<"rightclick">;
    rightdblclick: IMouseEvent<"rightdblclick">;
    rightmousedown: IMouseEvent<"rightmousedown">;
    rightmouseup: IMouseEvent<"rightmouseup">;
    scrollup: IMouseEvent<"scrollup">;
    scrolldown: IMouseEvent<"scrolldown">;
    scrollclick: IMouseEvent<"scrollclick">;
    scrolldblclick: IMouseEvent<"scrolldblclick">;
    scrollbtndown: IMouseEvent<"scrollbtndown">;
    scrollbtnup: IMouseEvent<"scrollbtnup">;
    mousemove: IMouseEvent<"mousemove">;
    dragstart: IMouseEvent<"dragstart">;
    drag: IDragMouseEvent<"drag">;
    dragend: IDragMouseEvent<"dragend">;
    default: IMouseEvent<MouseEventType>;
};

export type MouseEvent<T extends keyof MouseEventMap = "default"> =
    MouseEventMap[T];
