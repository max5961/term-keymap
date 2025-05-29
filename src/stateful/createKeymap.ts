import type { KeyMap } from "./match.js";
import { expandKeymap } from "./expandKeymap.js";

/**
 * Utility for attaching metadata to keymaps.  Expands keymaps into more easily
 * parsable expanded form.
 * */
export function createKeymap({
    keymap,
    name,
    callback,
}: {
    keymap: KeyMap | KeyMap[];
    name?: string;
    callback?: () => unknown;
}) {
    keymap = expandKeymap(keymap);
    return { keymap, name, callback };
}

export type EnhancedKeyMap = ReturnType<typeof createKeymap>;
