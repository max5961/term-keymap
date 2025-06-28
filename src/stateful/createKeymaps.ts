import type { KeyMap } from "./match.js";
import { expandKeymap } from "./expandKeymap.js";

export type KeyMapMetaData = {
    keymap: KeyMap | KeyMap[];
    name?: string;
    callback?: () => unknown;
};

export type SafeKeyMapMetaData = Omit<KeyMapMetaData, "keymap"> & {
    keymap: KeyMap[];
};

/**
 * For stricter type checking to ensure only keymap data with input length <= 1
 * is passed to InputState.process
 */
export class InputReadyKeyMaps {
    #keymaps: SafeKeyMapMetaData[];

    constructor(keymaps: SafeKeyMapMetaData[]) {
        this.#keymaps = keymaps;
    }

    get keymaps() {
        return this.#keymaps;
    }
}

export function createKeymaps(keymaps: KeyMapMetaData[]): InputReadyKeyMaps {
    return new InputReadyKeyMaps(
        keymaps.map((km) => {
            const keymap = expandKeymap(km.keymap);
            return {
                keymap: keymap,
                name: km.name,
                callback: km.callback,
            };
        }),
    );
}
