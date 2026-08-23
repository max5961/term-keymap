import { describe, expect, test } from "vitest";
import { MouseState } from "../../src";
import type { MouseEventType, MouseEvent } from "../../src/types";

describe("MouseState.process", () => {
    const mouse = new MouseState();

    let currentEvent: MouseEvent | undefined;
    const handler = (e: MouseEvent) => {
        currentEvent = e;
    };

    const initializeTest = (e: MouseEventType) => {
        mouse.__clearState();
        mouse.removeAllListeners();
        mouse.on(e, handler);
    };

    // mouse.on("click", handler);
    // mouse.on("dblclick", handler);
    // mouse.on("mousedown", handler);
    // mouse.on("mouseup", handler);
    // mouse.on("rightclick", handler);
    // mouse.on("rightdblclick", handler);
    // mouse.on("rightmousedown", handler);
    // mouse.on("rightmouseup", handler);
    // mouse.on("scrollup", handler);
    // mouse.on("scrolldown", handler);
    // mouse.on("scrollclick", handler);
    // mouse.on("scrolldblclick", handler);
    // mouse.on("scrollbtndown", handler);
    // mouse.on("scrollbtnup", handler);
    // mouse.on("mousemove", handler);
    // mouse.on("dragstart", handler);
    // mouse.on("drag", handler);
    // mouse.on("dragend", handler);

    test("mousedown", () => {
        initializeTest("mousedown");
        mouse.process(Buffer.from("\x1b[<0;1;1M"));
        expect(currentEvent).toEqual({
            type: "mousedown",
            clientX: 0,
            clientY: 0,
        });
    });

    test("mouseup", () => {
        initializeTest("mouseup");
        mouse.process(Buffer.from("\x1b[<0;1;1m"));
        expect(currentEvent).toEqual({
            type: "mouseup",
            clientX: 0,
            clientY: 0,
        });
    });

    test("click", () => {
        initializeTest("click");
        mouse.process(Buffer.from("\x1b[<0;1;1M"));
        mouse.process(Buffer.from("\x1b[<0;1;1m"));
        expect(currentEvent).toEqual({
            type: "click",
            clientX: 0,
            clientY: 0,
        });
    });

    test("dblclick", () => {
        initializeTest("dblclick");
        mouse.process(Buffer.from("\x1b[<0;1;1M"));
        mouse.process(Buffer.from("\x1b[<0;1;1m"));
        mouse.process(Buffer.from("\x1b[<0;1;1M"));
        mouse.process(Buffer.from("\x1b[<0;1;1m"));
        expect(currentEvent).toEqual({
            type: "dblclick",
            clientX: 0,
            clientY: 0,
        });
    });

    test("rightmousedown", () => {
        initializeTest("rightmousedown");
        mouse.process(Buffer.from("\x1b[<2;1;1M"));
        expect(currentEvent).toEqual({
            type: "rightmousedown",
            clientX: 0,
            clientY: 0,
        });
    });

    test("rightmouseup", () => {
        initializeTest("rightmouseup");
        mouse.process(Buffer.from("\x1b[<2;1;1m"));
        expect(currentEvent).toEqual({
            type: "rightmouseup",
            clientX: 0,
            clientY: 0,
        });
    });

    test("rightclick", () => {
        initializeTest("rightclick");
        mouse.process(Buffer.from("\x1b[<2;1;1M"));
        mouse.process(Buffer.from("\x1b[<2;1;1m"));
        expect(currentEvent).toEqual({
            type: "rightclick",
            clientX: 0,
            clientY: 0,
        });
    });

    test("rightdblclick", () => {
        initializeTest("rightdblclick");
        mouse.process(Buffer.from("\x1b[<2;1;1M"));
        mouse.process(Buffer.from("\x1b[<2;1;1m"));
        mouse.process(Buffer.from("\x1b[<2;1;1M"));
        mouse.process(Buffer.from("\x1b[<2;1;1m"));
        expect(currentEvent).toEqual({
            type: "rightdblclick",
            clientX: 0,
            clientY: 0,
        });
    });

    test("scrollbtndown", () => {
        initializeTest("scrollbtndown");
        mouse.process(Buffer.from("\x1b[<1;1;1M"));
        expect(currentEvent).toEqual({
            type: "scrollbtndown",
            clientX: 0,
            clientY: 0,
        });
    });

    test("scrollbtnup", () => {
        initializeTest("scrollbtnup");
        mouse.process(Buffer.from("\x1b[<1;1;1m"));
        expect(currentEvent).toEqual({
            type: "scrollbtnup",
            clientX: 0,
            clientY: 0,
        });
    });

    test("scrollclick", () => {
        initializeTest("scrollclick");
        mouse.process(Buffer.from("\x1b[<1;1;1M"));
        mouse.process(Buffer.from("\x1b[<1;1;1m"));
        expect(currentEvent).toEqual({
            type: "scrollclick",
            clientX: 0,
            clientY: 0,
        });
    });

    test("scrolldblclick", () => {
        initializeTest("scrolldblclick");
        mouse.process(Buffer.from("\x1b[<1;1;1M"));
        mouse.process(Buffer.from("\x1b[<1;1;1m"));
        mouse.process(Buffer.from("\x1b[<1;1;1M"));
        mouse.process(Buffer.from("\x1b[<1;1;1m"));
        expect(currentEvent).toEqual({
            type: "scrolldblclick",
            clientX: 0,
            clientY: 0,
        });
    });

    test("scrolldown", () => {
        initializeTest("scrolldown");
        mouse.process(Buffer.from("\x1b[<65;1;1M"));
        expect(currentEvent).toEqual({
            type: "scrolldown",
            clientX: 0,
            clientY: 0,
        });
    });

    test("scrollup", () => {
        initializeTest("scrollup");
        mouse.process(Buffer.from("\x1b[<64;1;1M"));
        expect(currentEvent).toEqual({
            type: "scrollup",
            clientX: 0,
            clientY: 0,
        });
    });

    test("mousemove", () => {
        initializeTest("mousemove");
        mouse.process(Buffer.from("\x1b[<35;1;1M"));
        expect(currentEvent).toEqual({
            type: "mousemove",
            clientX: 0,
            clientY: 0,
        });
    });

    describe("drag, dragstart, dragend", () => {
        const mouse = new MouseState();
        mouse.on("dragstart", handler);
        mouse.on("drag", handler);
        mouse.on("dragend", handler);

        test("dragstart", () => {
            mouse.process(Buffer.from("\x1b[<0;1;1M"));
            expect(currentEvent).toEqual({
                type: "dragstart",
                clientX: 0,
                clientY: 0,
            });
        });

        test("drag", () => {
            mouse.process(Buffer.from("\x1b[<32;2;2M"));
            expect(currentEvent).toEqual({
                type: "drag",
                clientX: 1,
                clientY: 1,
                dragStartX: 0,
                dragStartY: 0,
            });
        });

        test("dragend", () => {
            mouse.process(Buffer.from("\x1b[<0;3;3m"));
            expect(currentEvent).toEqual({
                type: "dragend",
                clientX: 2,
                clientY: 2,
                dragStartX: 0,
                dragStartY: 0,
            });
        });
    });

    test("consecutive clicks with different buttons do not dispatch dbl events", () => {
        let dbl = false;
        let rightDbl = false;
        const mouse = new MouseState();
        mouse.on("dblclick", () => (dbl = true));
        mouse.on("rightdblclick", () => (rightDbl = true));

        mouse.process(Buffer.from("\x1b[<0;1;1M"));
        mouse.process(Buffer.from("\x1b[<0;1;1m"));
        mouse.process(Buffer.from("\x1b[<2;1;1M"));
        mouse.process(Buffer.from("\x1b[<2;1;1m"));
        expect(dbl || rightDbl).toBe(false);
    });

    test("double clicks will not fire after timer has expired", async () => {
        const TIMER = 100;
        const mouse = new MouseState({ doubleTimer: TIMER });

        let dispatches = 0;
        mouse.on("dblclick", () => {
            ++dispatches;
        });

        mouse.process(Buffer.from("\x1b[<0;1;1M"));
        mouse.process(Buffer.from("\x1b[<0;1;1m"));

        await new Promise((res) => {
            setTimeout(() => {
                res(undefined);
            }, TIMER + 1);
        });

        mouse.process(Buffer.from("\x1b[<0;1;1M"));
        mouse.process(Buffer.from("\x1b[<0;1;1m"));

        // add another click to ensure test isn't passing just because double click is broken
        mouse.process(Buffer.from("\x1b[<0;1;1M"));
        mouse.process(Buffer.from("\x1b[<0;1;1m"));

        expect(dispatches).toBe(1);
    });
});
