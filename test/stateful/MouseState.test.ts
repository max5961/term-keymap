import { describe, expect, test } from "vitest";
import { MouseState } from "../../src/stateful/MouseState";
import type { MouseEventName, MouseEvent } from "../../src/types";

describe("MouseState.process", () => {
    const mouse = new MouseState();

    let currentEvent: MouseEvent | undefined;
    const handler = (e: MouseEvent) => {
        currentEvent = e;
    };

    const initializeTest = (e: MouseEventName) => {
        mouse.__clearState();
        mouse.removeAllListeners();
        mouse.on(e, handler);
    };

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

    describe("Handle processed MouseEvents from returned MouseEvents array", () => {
        test("click", () => {
            const mouse = new MouseState();
            mouse.process(Buffer.from("\x1b[<0;1;1M"));
            const { events } = mouse.process(Buffer.from("\x1b[<0;1;1m"));

            expect(events.some((e) => e.type === "click")).toBe(true);
        });

        test("mousedown", () => {
            const mouse = new MouseState();
            const { events } = mouse.process(Buffer.from("\x1b[<0;1;1M"));

            expect(events.some((e) => e.type === "mousedown")).toBe(true);
        });

        test("mouseup", () => {
            const mouse = new MouseState();
            mouse.process(Buffer.from("\x1b[<0;1;1M"));
            const { events } = mouse.process(Buffer.from("\x1b[<0;1;1m"));
            expect(events.some((e) => e.type === "mouseup")).toBe(true);
        });

        test("dblclick", () => {
            const mouse = new MouseState();
            mouse.process(Buffer.from("\x1b[<0;1;1M"));
            mouse.process(Buffer.from("\x1b[<0;1;1m"));
            mouse.process(Buffer.from("\x1b[<0;1;1M"));
            const { events } = mouse.process(Buffer.from("\x1b[<0;1;1m"));
            expect(events.some((e) => e.type === "dblclick")).toBe(true);
        });

        test("rightmousedown", () => {
            const mouse = new MouseState();
            const { events } = mouse.process(Buffer.from("\x1b[<2;1;1M"));
            expect(events.some((e) => e.type === "rightmousedown")).toBe(true);
        });

        test("rightmouseup", () => {
            const mouse = new MouseState();
            mouse.process(Buffer.from("\x1b[<2;1;1M"));
            const { events } = mouse.process(Buffer.from("\x1b[<2;1;1m"));
            expect(events.some((e) => e.type === "rightmouseup")).toBe(true);
        });

        test("rightclick", () => {
            const mouse = new MouseState();
            mouse.process(Buffer.from("\x1b[<2;1;1M"));
            const { events } = mouse.process(Buffer.from("\x1b[<2;1;1m"));
            expect(events.some((e) => e.type === "rightclick")).toBe(true);
        });

        test("rightdblclick", () => {
            const mouse = new MouseState();
            mouse.process(Buffer.from("\x1b[<2;1;1M"));
            mouse.process(Buffer.from("\x1b[<2;1;1m"));
            mouse.process(Buffer.from("\x1b[<2;1;1M"));
            const { events } = mouse.process(Buffer.from("\x1b[<2;1;1m"));
            expect(events.some((e) => e.type === "rightdblclick")).toBe(true);
        });

        test("scrollbtndown", () => {
            const mouse = new MouseState();
            const { events } = mouse.process(Buffer.from("\x1b[<1;1;1M"));
            expect(events.some((e) => e.type === "scrollbtndown")).toBe(true);
        });

        test("scrollbtnup", () => {
            const mouse = new MouseState();
            mouse.process(Buffer.from("\x1b[<1;1;1M"));
            const { events } = mouse.process(Buffer.from("\x1b[<1;1;1m"));
            expect(events.some((e) => e.type === "scrollbtnup")).toBe(true);
        });

        test("scrollclick", () => {
            const mouse = new MouseState();
            mouse.process(Buffer.from("\x1b[<1;1;1M"));
            const { events } = mouse.process(Buffer.from("\x1b[<1;1;1m"));
            expect(events.some((e) => e.type === "scrollclick")).toBe(true);
        });

        test("scrolldblclick", () => {
            const mouse = new MouseState();
            mouse.process(Buffer.from("\x1b[<1;1;1M"));
            mouse.process(Buffer.from("\x1b[<1;1;1m"));
            mouse.process(Buffer.from("\x1b[<1;1;1M"));
            const { events } = mouse.process(Buffer.from("\x1b[<1;1;1m"));
            expect(events.some((e) => e.type === "scrolldblclick")).toBe(true);
        });

        test("scrolldown", () => {
            const mouse = new MouseState();
            const { events } = mouse.process(Buffer.from("\x1b[<65;1;1M"));
            expect(events.some((e) => e.type === "scrolldown")).toBe(true);
        });

        test("scrollup", () => {
            const mouse = new MouseState();
            const { events } = mouse.process(Buffer.from("\x1b[<64;1;1M"));
            expect(events.some((e) => e.type === "scrollup")).toBe(true);
        });

        test("mousemove", () => {
            const mouse = new MouseState();
            const { events } = mouse.process(Buffer.from("\x1b[<35;1;1M"));
            expect(events.some((e) => e.type === "mousemove")).toBe(true);
        });

        describe("drag, dragstart, dragend", () => {
            const mouse = new MouseState();

            test("dragstart", () => {
                const { events } = mouse.process(Buffer.from("\x1b[<0;1;1M"));
                expect(events.some((e) => e.type === "dragstart")).toBe(true);
            });

            test("drag", () => {
                const { events } = mouse.process(Buffer.from("\x1b[<32;2;2M"));
                expect(events.some((e) => e.type === "drag")).toBe(true);
            });

            test("dragend", () => {
                const { events } = mouse.process(Buffer.from("\x1b[<0;3;3m"));
                expect(events.some((e) => e.type === "dragend")).toBe(true);
            });
        });

        test("returned MouseEvent[] refreshes after every stdin event (mouse stdin)", () => {
            const mouse = new MouseState();

            const press1 = mouse.process(Buffer.from("\x1b[<0;1;1M"));
            const press2 = mouse.process(Buffer.from("\x1b[<0;1;1m"));

            const press1set = new Set(press1.events.map((e) => e.type));
            const press2set = new Set(press2.events.map((e) => e.type));

            expect(
                press1set.has("mousedown") && press1set.has("dragstart"),
            ).toBe(true);
            expect(
                !press2set.has("mousedown") && !press2set.has("dragstart"),
            ).toBe(true);
        });

        test("returned MouseEvent[] refreshes after every stdin event (keypress stdin)", () => {
            const mouse = new MouseState();

            const press1 = mouse.process(Buffer.from("\x1b[<0;1;1M"));
            const press2 = mouse.process(Buffer.from("a"));

            const press1set = new Set(press1.events.map((e) => e.type));
            const press2set = new Set(press2.events.map((e) => e.type));
            expect(
                press1set.has("mousedown") && press1set.has("dragstart"),
            ).toBe(true);
            expect(press2set.size).toBe(0);
        });
    });
});
