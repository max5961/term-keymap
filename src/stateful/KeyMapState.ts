import { INVALID_KEYMAP } from "../constants.js";
import { tokenize } from "../tokenize/tokenize.js";
import type { Action, Data, KeyMap, LeaderKeyMap } from "../types.js";
import { KeyMapBuilder } from "../util/KeyMapBuilder.js";
import { ActionStore, type IActionStore } from "./ActionStore.js";
import { expandKeymap } from "./expandKeymap.js";
import { InputState, type IInputState } from "./InputState.js";

type Opts = {
    actions?: Action[];
    leader?: LeaderKeyMap;
    leaderTimeout?: number;
    maxDepth?: number;
};

export interface IKeyMapState extends IInputState, IActionStore {
    process(buf: Buffer): ReturnType<IInputState["process"]>;
}

export class KeyMapState implements IKeyMapState {
    private readonly store: ActionStore;
    private readonly inputState: InputState;
    private readonly leader?: KeyMap[];
    /** @internal */
    public get __store() {
        return this.store;
    }
    /** @internal */
    public get __inputState() {
        return this.inputState;
    }

    constructor(opts: Opts = {}) {
        if (opts.leader) {
            this.leader = this.getLeader(opts.leader);
        }
        this.store = new ActionStore({
            leader: this.leader,
            actions: opts.actions,
        });
        this.inputState = new InputState({
            leader: this.leader,
            leaderTimeout: opts.leaderTimeout,
            maxDepth: opts.maxDepth,
        });
    }

    public addAction(action: Action): () => void {
        return this.store.addAction(action);
    }

    public removeAction(action: Action): void {
        return this.store.removeAction(action);
    }

    public clearActions(): void {
        return this.store.clearActions();
    }

    public process(buf: Buffer): {
        data: Data;
        keymap?: KeyMap[];
        name?: string;
    } {
        return this.inputState.process(buf, this.store);
    }

    public clearState(): void {
        return this.inputState.clearState();
    }

    private getLeader(leader: LeaderKeyMap): KeyMap[] | undefined {
        if (typeof leader === "string") {
            return expandKeymap(tokenize(leader));
        } else if (leader instanceof KeyMapBuilder) {
            const result = leader.$$read();
            return result !== INVALID_KEYMAP ? result : undefined;
        } else {
            return expandKeymap(leader);
        }
    }
}
