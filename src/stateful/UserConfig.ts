import { toArray } from "../util/toArray.js";
import { expandKeymap } from "./expandKeymap.js";
import { type KeyMap } from "../types.js";
import { tokenize } from "../tokenize/tokenize.js";

export type Action = {
    keymap: KeyMap | KeyMap[] | string;
    name?: string;
    callback?: () => unknown;
};

/**
 * Transformed `Action` such that `keymap` is always in expanded form and `leader`
 * is removed as an option from keymap.
 */
export type SanitizedAction = Omit<Action, "keymap"> & {
    keymap: Omit<KeyMap, "leader">[];
};

/**
 * Sanitized Actions and leader data that can be more easily checked against
 * a history of stdin data.
 */
export class UserConfig {
    #actions: SanitizedAction[];
    #leader: KeyMap[] | undefined;
    #leaderTimeout: number;

    constructor(
        actions: Action[],
        leader?: KeyMap | KeyMap[],
        leaderTimeout?: number,
    ) {
        this.#leader = leader ? expandKeymap(leader) : leader;
        this.#leaderTimeout = leaderTimeout ?? 1000;
        this.#actions = this.sanitizeActions(actions);
    }

    private sanitizeActions(actions: Action[]): SanitizedAction[] {
        return actions.map((action) => {
            return { ...action, keymap: this.sanitizeKeymap(action.keymap) };
        });
    }

    private sanitizeKeymap(keymap: KeyMap | KeyMap[] | string): KeyMap[] {
        const sequence =
            typeof keymap === "string" ? tokenize(keymap) : toArray(keymap);
        const result = [] as KeyMap[];

        for (let i = 0; i < sequence.length; ++i) {
            const leader = sequence[i].leader;
            const node = expandKeymap(sequence[i]);

            // Leader sequence should be appended first if it exists
            if (leader) {
                // Sequence is dependent on global leader which is absent, so essentially
                // nullify the sequence.  <leader>a for example, should NOT match
                // 'a'.  Could have a console.warn here in the future.
                if (!this.leader) {
                    return [];
                } else {
                    result.push(...this.leader);
                }
            }

            result.push(...node);
        }

        return result;
    }

    get actions() {
        return this.#actions;
    }

    get leader() {
        return this.#leader;
    }

    get leaderTimeout() {
        return this.#leaderTimeout;
    }
}
