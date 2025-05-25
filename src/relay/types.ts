import type PeekSet from "../helpers/PeekSet.js";
import type { Data, Key } from "../types.js";

export type RegisterData = {
    key: PeekSet<Key>;
    input: PeekSet<string>;
    raw: Data["raw"];
    mouse?: Data["mouse"];
};
