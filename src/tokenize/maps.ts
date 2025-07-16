import { type Modifier } from "../types.js";
import { type Key } from "../types.js";

export const ModMap: Record<string, Modifier> = {
    C: "ctrl",
    A: "alt",
    D: "super",
    M: "meta",
    H: "hyper",
} as const;

export const KeyAliases: Record<string, Key> = {
    CR: "return",
    BS: "backspace",
    DEL: "delete",
};
