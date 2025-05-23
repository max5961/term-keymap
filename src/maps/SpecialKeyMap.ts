import { type Key } from "../types.js";

export const SpecialKeyMap: Record<string, Key> = {
    "\x1B[3~": "delete",
    "\x7F": "backspace",
    "\x1B[2~": "insert",
    "\x1B[A": "up",
    "\x1B[B": "down",
    "\x1B[C": "right",
    "\x1B[D": "left",
    "\x1BOP": "f1",
    "\x1BOQ": "f2",
    "\x1BOR": "f3",
    "\x1BOS": "f4",
    "\x1B[15~": "f5",
    "\x1B[17~": "f6",
    "\x1B[18~": "f7",
    "\x1B[19~": "f8",
    "\x1B[20~": "f9",
    "\x1B[21~": "f10",
    "\x1B[23~": "f11",
    "\x1B[24~": "f12",
} as const;
