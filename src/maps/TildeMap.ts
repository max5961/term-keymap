import type { Key } from "../types.js";

export const TildeMap: Record<number, Key> = {
    2: "insert",
    3: "delete",
    5: "pageUp",
    6: "pageDown",

    /* f1-f4 use the letter 0 and PQRS */
    15: "f5",
    17: "f6",
    18: "f7",
    19: "f8",
    20: "f9",
    21: "f10",
    23: "f11",
    24: "f12",
} as const;
