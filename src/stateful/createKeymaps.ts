import type { KeyMap } from "./match.js";
import { expandKeymap } from "./expandKeymap.js";
import { toArray } from "../util/toArray.js";

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
    #leader: KeyMap[] | undefined;
    #leaderTimeout: number;

    constructor(
        keymaps: SafeKeyMapMetaData[],
        leader?: KeyMap[],
        leaderTimeout?: number,
    ) {
        this.#keymaps = keymaps;
        this.#leader = leader;
        this.#leaderTimeout = leaderTimeout ?? 1000;
    }

    get keymaps() {
        return this.#keymaps;
    }

    get leader() {
        return this.#leader;
    }

    get leaderTimeout() {
        return this.#leaderTimeout;
    }
}

export function createKeymapsWithLeader(
    leader?: Omit<KeyMap, "leader"> | Omit<KeyMap, "leader">[],
    leaderTimeout?: number,
) {
    return (keymaps: KeyMapMetaData[]): InputReadyKeyMaps => {
        let leaderKeymap: KeyMap[] | undefined = undefined;
        if (leader) {
            leaderKeymap = expandKeymap(leader);
        }

        const safeKeymaps = keymaps.map((km) => {
            const kmArr = toArray(km.keymap);
            const result = [] as KeyMap[];
            for (let i = 0; i < kmArr.length; ++i) {
                // leader being set prepends leader keymap to current iteration
                if (leaderKeymap && kmArr[i].leader) {
                    result.push(...leaderKeymap);
                }
                result.push(kmArr[i]);
            }

            const keymap = expandKeymap(result);
            return {
                keymap: keymap,
                name: km.name,
                callback: km.callback,
            };
        });

        return new InputReadyKeyMaps(safeKeymaps, leaderKeymap, leaderTimeout);
    };
}

export const createKeymaps = createKeymapsWithLeader();
