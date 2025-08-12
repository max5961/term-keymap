import type { createActionsWithLeader } from "./createActions.js";
import { UserConfig } from "./UserConfig.js";
import type { Action } from "../types.js";

type Params = Parameters<typeof createActionsWithLeader>;

export class ActionStore {
    private active: Set<Action>;
    private leader: Params[0];
    private leaderTimeout: Params[1];
    #isPaused: boolean;

    constructor(...params: Params) {
        this.active = new Set();
        this.leader = params[0];
        this.leaderTimeout = params[1];
        this.#isPaused = false;
    }

    /**
     * Subscribes action(s) to the store. Actions are tracked by reference, so
     * duplicate subscriptions of the same action have no effect.

     * Returns a function to unsubscribe each of the provided actions.
     */
    public subscribe = (...actions: Action[]) => {
        actions.forEach((action) => this.active.add(action));
        return () => {
            actions.forEach((action) => this.active.delete(action));
        };
    };

    public unsubscribe = (...actions: Action[]) => {
        actions.forEach((action) => this.active.delete(action));
    };

    /**
     * Returns a `UserConfig` object which contains a sanitized version of the
     * actions subscribed to the store.  If the store is paused, subscribed actions
     * are ignored.
     */
    public getActions = (): UserConfig => {
        const actions = this.isPaused ? [] : Array.from(this.active.values());
        return new UserConfig(actions, this.leader, this.leaderTimeout);
    };

    /**
     * Same as `ActionStore.getActions` but accepts an array of additional Actions
     * to be sanitized.
     */
    public getCombinedActions = (additional: Action[]): UserConfig => {
        const actions = this.isPaused
            ? []
            : [...this.active.values(), ...additional];

        return new UserConfig(actions, this.leader, this.leaderTimeout);
    };

    /**
     * Temporarily disables all actions by making `getActions()` return an empty list.
     * Useful when input should be ignored without needing to modify subscriptions.
     */
    public pause = () => {
        this.#isPaused = true;
    };

    /**
     * Re-enables action retrieval — `getActions()` will return subscribed actions again.
     */
    public resume = () => {
        this.#isPaused = false;
    };

    public get isPaused(): boolean {
        return this.#isPaused;
    }
}
