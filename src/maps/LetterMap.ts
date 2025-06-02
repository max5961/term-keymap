import type { Key } from "../types.js";

export type LetterKey =
    | "A"
    | "B"
    | "C"
    | "D"
    // | "E"
    | "F"
    | "H"
    | "P"
    | "Q"
    | "R"
    | "S";

export const LetterMap: Record<string, Key> = {
    A: "up",
    B: "down",
    C: "right",
    D: "left",
    // E: "",
    F: "end",
    H: "home",
    P: "f1",
    Q: "f2",
    R: "f3",
    S: "f4",
} as const;
