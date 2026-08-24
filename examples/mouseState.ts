import {
    configureStdin,
    MouseState,
    parseBuffer,
    type MouseEvent,
} from "../src/index.js";

configureStdin({
    enableMouse: true,
    mouseMode: 3,
});

const mouse = new MouseState();

const handler = (e: MouseEvent) => {
    console.log(e);
};

mouse.on("click", handler);
mouse.on("dblclick", handler);
mouse.on("mousedown", handler);
mouse.on("mouseup", handler);
mouse.on("rightclick", handler);
mouse.on("rightdblclick", handler);
mouse.on("rightmousedown", handler);
mouse.on("rightmouseup", handler);
mouse.on("scrollup", handler);
mouse.on("scrolldown", handler);
mouse.on("scrollclick", handler);
mouse.on("scrolldblclick", handler);
mouse.on("scrollbtndown", handler);
mouse.on("scrollbtnup", handler);
mouse.on("mousemove", handler);
mouse.on("dragstart", handler);
mouse.on("drag", handler);
mouse.on("dragend", handler);

process.stdin.on("data", (buf) => {
    const data = parseBuffer(buf);
    if (data.key.only("ctrl") && data.input.only("c")) {
        process.exit();
    }

    const mousedata = mouse.process(data);

    // In the example we are setting listeners to handle events, but events can
    // also be handled by iterating the returned array of MouseEvent objects
    // mousedata.events.forEach((event) => {
    //     console.log(event.type, event);
    // });
});
