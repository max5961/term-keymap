import { tokenize } from "../tokenize/tokenize.js";
import type { KeyMap } from "../types.js";
import { toArray } from "../util/toArray.js";
import { expandKeymap } from "./expandKeymap.js";
import type { Action, ExpandedKeyMap, ExpandedAction } from "../types.js";
import { BaseKeyMapBuilder } from "../util/KeyMapBuilder.js";
import { INVALID_ACTION, INVALID_KEYMAP } from "../constants.js";

export interface IActionStore {
    clearActions(): void;
    addAction(action: Action): () => void;
    removeAction(action: Action): void;
}

type ActionStoreOpts = {
    actions?: Action[];
    leader?: KeyMap[];
};

export class ActionStore implements IActionStore {
    private map: Map<Action, ExpandedAction>;
    private sortedActions: Map<number, Set<ExpandedAction>>;
    private cachedActions: ExpandedAction[] | undefined;
    private readonly leader?: KeyMap[];

    constructor(opts: ActionStoreOpts = {}) {
        this.map = new Map();
        this.sortedActions = new Map();
        this.leader = opts.leader;

        if (opts.actions) {
            for (let i = 0; i < opts.actions.length; ++i) {
                this.addAction(opts.actions[i]);
            }
        }
    }

    public clearActions() {
        this.map = new Map();
        this.sortedActions = new Map();
        this.cachedActions = undefined;
    }

    public addAction(action: Action) {
        if (this.map.has(action)) return () => this.removeAction(action);

        const expanded = this.getExpandedAction(action);
        if (expanded === INVALID_ACTION) {
            return () => {};
        }

        this.cachedActions = undefined;
        this.map.set(action, expanded);

        const length = expanded.keymap.length;
        if (!this.sortedActions.get(length)) {
            this.sortedActions.set(length, new Set());
        }
        this.sortedActions.get(length)!.add(expanded);

        return () => this.removeAction(action);
    }

    public removeAction(action: Action): void {
        if (!this.map.has(action)) return;
        this.cachedActions = undefined;

        const raw = this.map.get(action)!;
        const length = raw.keymap.length;
        this.map.delete(action);
        this.sortedActions.get(length)?.delete(raw);
        if (this.sortedActions.get(length)?.size === 0) {
            this.sortedActions.delete(length);
        }
    }

    /**
     * Returns an array of raw actions sorted in ascending order by length of the
     * action
     * */
    public getSortedActions(): ExpandedAction[] {
        if (this.cachedActions) {
            return this.cachedActions;
        }

        const sortedKeys = [...this.sortedActions.keys()].sort((a, b) => a - b);
        const result: ExpandedAction[] = [];
        for (let i = 0; i < sortedKeys.length; ++i) {
            const set = this.sortedActions.get(sortedKeys[i])!;
            result.push(...set);
        }

        this.cachedActions = result;
        return result;
    }

    private getExpandedAction(
        action: Action,
    ): ExpandedAction | typeof INVALID_ACTION {
        const expanded =
            action.keymap instanceof BaseKeyMapBuilder
                ? action.keymap.$$read(this.leader)
                : this.getExpandedKeymap(action.keymap);

        if (expanded === INVALID_KEYMAP) {
            return INVALID_ACTION;
        }
        return {
            ...action,
            keymap: expanded,
        };
    }

    private getExpandedKeymap(
        keymap: KeyMap | KeyMap[] | string,
    ): ExpandedKeyMap | typeof INVALID_KEYMAP {
        const sequence =
            typeof keymap === "string" ? tokenize(keymap) : toArray(keymap);

        const result: KeyMap[] = [];
        for (let i = 0; i < sequence.length; ++i) {
            const keymap = sequence[i];
            if (keymap.leader) {
                if (this.leader) {
                    result.push(...this.leader);
                } else {
                    return INVALID_KEYMAP;
                }
            }

            const expanded = expandKeymap(keymap);
            for (const km of expanded) {
                if (km.input || km.key) result.push(km);
            }
        }

        return result;
    }
}
