import type { KeyMap } from "./match.js";
import { UserConfig, type Action } from "./UserConfig.js";

export function createActionsWithLeader(
    leader?: Omit<KeyMap, "leader"> | Omit<KeyMap, "leader">[],
    leaderTimeout?: number,
) {
    return (actions: Action[]): UserConfig => {
        return new UserConfig(actions, leader, leaderTimeout);
    };
}

export const createActions = createActionsWithLeader();
