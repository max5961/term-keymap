/* eslint-disable no-control-regex */

import { CtrlKeyMap } from "../maps/CtrlKeyMap.js";
import { type Data } from "../types.js";

export function parseXterm(data: Data): void {
    const code = data.raw.buffer[0];
    const comboCode = data.raw.buffer[1];

    const parseCtrlChar = (code: number): void => {
        data.key.add("ctrl");
        data.input = CtrlKeyMap[code];

        // Ambiguous mappings update both input and the key
        if (code === 9) data.key.add("tab");
        if (code === 13) data.key.add("return");
        if (code === 127) data.key.add("backspace");
        if (code === 8) data.key.add("backspace");
    };

    // ctrl sequence
    if (code in CtrlKeyMap) {
        parseCtrlChar(code);
    }

    // esc or esc + alt
    else if (code === 27 && (comboCode === undefined || comboCode === 27)) {
        data.key.add("esc");
        data.key.add("ctrl");
        data.input.add("3"); // ambiguity
        data.input.add("["); // ambiguity

        if (comboCode === 27) data.key.add("alt");
    }

    // (alt + char) | (alt + ctrl + char)
    else if (
        code === 27 &&
        comboCode !== undefined &&
        data.raw.buffer.length === 2
    ) {
        data.key.add("alt");

        if (comboCode in CtrlKeyMap) {
            parseCtrlChar(comboCode);
        } else {
            data.input.add(String.fromCharCode(comboCode));
        }
    }

    // non escape character
    else if (data.raw.utf && !new RegExp(/^\x1b/).test(data.raw.utf)) {
        data.input.add(data.raw.utf);
    }
}
