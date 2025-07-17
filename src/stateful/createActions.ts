import { UserConfig, type Action } from "./UserConfig.js";
import type { KeyMap } from "../types.js";
import { tokenize } from "../tokenize/tokenize.js";

export function createActionsWithLeader(
    leader?: Omit<KeyMap, "leader"> | Omit<KeyMap, "leader">[] | string,
    leaderTimeout?: number,
) {
    leader = typeof leader === "string" ? tokenize(leader) : leader;

    return (actions: Action[]): UserConfig => {
        return new UserConfig(actions, leader, leaderTimeout);
    };
}

export const createActions = createActionsWithLeader();
