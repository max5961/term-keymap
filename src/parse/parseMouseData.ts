import { CsiRegex } from "../helpers/CsiRegex.js";
import type { Data } from "../types.js";

/**
 * If the data is revealed to be a mouse event, the event is parsed and data
 * is updated.
 *
 * @returns boolean indicating whether or not it was a mouse event so that the
 * calling block can either return or continue
 */
export function parseMouseData(data: Data) {
    const matches = CsiRegex.getMouseEvent(data.raw.utf);
    if (!matches.length) return;

    const event = Number(matches[1]);
    const x = Number(matches[2]) - 1;
    const y = Number(matches[3]) - 1;
    const down = matches[4] === "M";

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
