import type { Data } from "../types.js";
import { Decode } from "../util/Decode.js";

/**
 * If the data is revealed to be a mouse event, the event is parsed and data
 * is updated.
 *
 * @returns boolean indicating whether or not it was a mouse event so that the
 * calling block can either return or continue
 */
export function parseMouse(data: Data) {
    const captures = Decode.getMouseCaptures(data.raw.utf);
    if (!captures.length) return;

    const event = Number(captures[0]);
    const x = Number(captures[1]) - 1;
    const y = Number(captures[2]) - 1;
    const down = captures[3] === "M";

    data.mouse = {
        x,
        y,
        leftBtnDown: (event === 0 && down) || event === 32,
        rightBtnDown: (event === 2 && down) || event === 34,
        scrollBtnDown: (event === 1 && down) || event === 33,
        releaseBtn: !down,
        scrollUp: event === 64,
        scrollDown: event === 65,
        mousemove: event >= 32 && event <= 35,
    };
}
