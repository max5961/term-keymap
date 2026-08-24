import { parseBuffer } from "../parsers/parseBuffer.js";
import type { Data, MouseData, MouseEvent, MouseEventName } from "../types.js";

type MouseStateOpts = {
    /**
     * time in ms before double clicks cannot occur
     * @default 500
     * */
    doubleTimer?: number;
};

export class MouseState {
    private handlers: Map<string, Set<(event: MouseEvent) => unknown>>;
    private dispatchedEvents: MouseEvent[];
    private prevMouse: MouseData | undefined;
    private dblTimer: number;
    private dblTimeoutID: ReturnType<typeof setTimeout> | undefined;
    private dragStartPoint: { x: number; y: number } | undefined;
    private isDragging: boolean;
    private lastClick: "L" | "R" | "S" | undefined;

    private get canEmitDouble() {
        return this.dblTimeoutID !== undefined;
    }

    /** @internal for testing */
    public __clearState() {
        clearTimeout(this.dblTimeoutID);
        this.isDragging = false;
        this.lastClick = undefined;
    }

    constructor(opts: MouseStateOpts = {}) {
        opts.doubleTimer ??= 500;
        this.handlers = new Map();
        this.dispatchedEvents = [];
        this.dblTimer = opts.doubleTimer;
        this.isDragging = false;
    }

    public on<T extends MouseEventName>(
        event: T,
        cb: (event: MouseEvent<T>) => unknown,
    ): void {
        this.pushHandler(event, cb);
    }

    public off<T extends MouseEventName>(
        event: T,
        cb: (event: MouseEvent<T>) => unknown,
    ): void {
        this.removeHandler(event, cb);
    }

    public removeAllListeners() {
        this.handlers = new Map();
    }

    private pushHandler(event: string, cb: any) {
        if (!this.handlers.get(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(cb);
    }

    private removeHandler(event: string, cb: any) {
        const set = this.handlers.get(event);
        if (set) {
            set.delete(cb);
            if (!set.size) {
                this.handlers.delete(event);
            }
        }
    }

    public process(buf: Buffer): { data: Data; events: MouseEvent[] };
    public process(data: Data): { data: Data; events: MouseEvent[] };
    public process(v: Buffer | Data): { data: Data; events: MouseEvent[] } {
        if (Buffer.isBuffer(v)) {
            v = parseBuffer(v);
        }

        if (v.mouse) {
            this.isDragging = false;
            this.handleMouse(v.mouse);
        }

        const events = [...this.dispatchedEvents];
        this.dispatchedEvents = [];
        return { data: v, events };
    }

    private handleMouse(mouse: MouseData): void {
        const dispatch = this.dispatchEvent(mouse.x, mouse.y);

        // SCROLL
        if (mouse.scrollUp) {
            dispatch("scrollup");
        }
        if (mouse.scrollDown) {
            dispatch("scrolldown");
        }

        // BUTTON DOWN / DRAG_START
        if (mouse.leftBtnDown) {
            dispatch("mousedown");

            if (!this.prevMouse?.leftBtnDown) {
                dispatch("dragstart");
                this.dragStartPoint = { x: mouse.x, y: mouse.y };
                this.isDragging = true;
            }
        }
        if (mouse.rightBtnDown) {
            dispatch("rightmousedown");
        }
        if (mouse.scrollBtnDown) {
            dispatch("scrollbtndown");
        }

        // MOVEMENT / DRAG
        if (mouse.mousemove) {
            dispatch("mousemove");
            if (this.prevMouse?.leftBtnDown) {
                dispatch("drag");
                this.isDragging = true;
            }
        }

        this.handleRelease(mouse);
        this.prevMouse = mouse;

        if (!this.isDragging) {
            this.dragStartPoint = undefined;
        }
    }

    private handleRelease(mouse: MouseData) {
        if (!mouse.releaseBtn || !this.prevMouse) return;

        const dispatch = this.dispatchDbl(mouse);

        if (this.prevMouse.leftBtnDown) {
            dispatch("click");
            dispatch("mouseup");
            this.lastClick = "L";

            if (this.prevMouse.mousemove) {
                dispatch("dragend");
                this.isDragging = true;
            }
        } else if (this.prevMouse.rightBtnDown) {
            dispatch("rightclick");
            dispatch("rightmouseup");
            this.lastClick = "R";
        } else if (this.prevMouse.scrollBtnDown) {
            dispatch("scrollclick");
            dispatch("scrollbtnup");
            this.lastClick = "S";
        }

        if (!this.dblTimeoutID) {
            this.dblTimeoutID = setTimeout(() => {
                clearTimeout(this.dblTimeoutID);
                this.dblTimeoutID = undefined;
                this.lastClick = undefined;
            }, this.dblTimer);
        }
    }

    private dispatchEvent =
        (x: number, y: number) => (eventType: MouseEventName) => {
            const handlers = this.handlers.get(eventType);

            const event = {
                type: eventType,
                clientX: x,
                clientY: y,
            } as MouseEvent;

            // prettier-ignore
            if (eventType === "drag" || eventType === "dragend") {
                (event as MouseEvent<"drag" | "dragend">).dragStartX = this.dragStartPoint!.x;
                (event as MouseEvent<"drag" | "dragend">).dragStartY = this.dragStartPoint!.y;
            }

            this.dispatchedEvents.push(event);
            if (!handlers) return;
            handlers.forEach((h) => {
                h(event);
            });
        };

    private dispatchDbl = (mouse: MouseData) => {
        const dispatch = this.dispatchEvent(mouse.x, mouse.y);

        return (eventType: MouseEventName) => {
            dispatch(eventType);

            if (!this.canEmitDouble) {
                return;
            }

            if (eventType === "click" && this.lastClick === "L") {
                dispatch("dblclick");
                this.lastClick = undefined;
            } else if (eventType === "rightclick" && this.lastClick === "R") {
                dispatch("rightdblclick");
                this.lastClick = undefined;
            } else if (eventType === "scrollclick" && this.lastClick === "S") {
                dispatch("scrolldblclick");
                this.lastClick = undefined;
            }
        };
    };
}
