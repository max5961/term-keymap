import { tokenize } from "../tokenize/tokenize.js";
import type { KeyMap, RawKeyMap } from "../types.js";
import { toArray } from "../util/toArray.js";
import { expandKeymap } from "./expandKeymap.js";
import type { Action, RawAction } from "../types.js";

export const LEADER = Symbol("term-keymap.leader");

export class ActionStore {
    private map: Map<Action, RawAction>;
    private sortedActions: Map<number, Set<RawAction>>;
    private computedActions: RawAction[] | undefined;

    constructor() {
        this.map = new Map();
        this.sortedActions = new Map();
    }

    public addAction(action: Action) {
        if (this.map.has(action)) return () => {};
        this.computedActions = undefined;

        const raw = this.getRawAction(action);
        this.map.set(action, raw);

        const length = raw.keymap.length;
        if (!this.sortedActions.get(length)) {
            this.sortedActions.set(length, new Set());
        }
        this.sortedActions.get(length)!.add(raw);

        return () => this.removeAction(action);
    }

    public removeAction(action: Action): boolean {
        if (!this.map.has(action)) return false;
        this.computedActions = undefined;

        const raw = this.map.get(action)!;
        const length = raw.keymap.length;
        this.map.delete(action);
        this.sortedActions.get(length)?.delete(raw);
        if (this.sortedActions.get(length)?.size === 0) {
            this.sortedActions.delete(length);
        }

        return true;
    }

    /** @internal
     * Returns an array of raw actions sorted in ascending order by length of the
     * action
     * */
    public _getRawActions(): RawAction[] {
        if (this.computedActions) {
            return this.computedActions;
        }

        const sortedKeys = [...this.sortedActions.keys()].sort((a, b) => a - b);
        const result: RawAction[] = [];
        for (let i = 0; i < sortedKeys.length; ++i) {
            const set = this.sortedActions.get(sortedKeys[i])!;
            result.push(...set);
        }

        this.computedActions = result;
        return result;
    }

    private getRawAction(action: Action): RawAction {
        return {
            ...action,
            keymap: this.getRawKeymap(action.keymap),
        };
    }

    private getRawKeymap(keymap: KeyMap | KeyMap[] | string): RawKeyMap[] {
        const sequence =
            typeof keymap === "string" ? tokenize(keymap) : toArray(keymap);

        const result: RawKeyMap[] = [];
        for (let i = 0; i < sequence.length; ++i) {
            const keymap = sequence[i];
            if (keymap.leader) {
                result.push(LEADER);
            }

            const expanded = expandKeymap(keymap);
            for (const km of expanded) {
                if (km.input || km.key) result.push(km);
            }
        }

        return result;
    }
}
