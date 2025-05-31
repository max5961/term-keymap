import type { Key } from "../types.js";

export const CsiChars: Record<string, Key> = {
    A: "up",
    B: "down",
    C: "right",
    D: "left",
    // E: "",
    H: "home",
    F: "end",
    P: "f1",
    Q: "f2",
    R: "f3",
    S: "f4",
} as const;
