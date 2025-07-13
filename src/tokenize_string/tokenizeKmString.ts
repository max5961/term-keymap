import { type KeyMap } from "../stateful/match.js";
import { type Key, type Modifier } from "../types.js";
import { ModMap, KeySet, KeyAliases } from "./helpers.js";

export type ArrayOnlyKeyMap = KeyMap & { key?: Key[] };

/**
 * VALID GROUPING RULES - if any of these are not true, we interpret the < as a char
 *
 * - The first '>' character closes the grouping
 *
 * - The first member of the sequence must be either a Mod or a Key.  If it is a
 *   Mod, it **must** be paired with something else.  If it paired with only Mods,
 *   then the final mod will be interpreted as the string literal
 *
 * - Must be followed immediately by a modifier WITH a counterpart
 *   (key or non-special-char).  Modifiers cannot exist alone
 *
 * - Valid groupings must be ordered in the following priority order:
 *   Modifiers -> Keys -> non-special-chars
 *
 * - Keys must be separated by '-' characters
 *
 * HANDLING EDGE CASES
 *
 * Modifiers are represented by single characters and can be upper or lowercase.
 * This means that <A-a> could be interpreted as Alt + Alt but what we want is
 * Alt + 'a'. To handle this:
 *
 * - Mods cannot be repeated.  So we need to keep a Set of used mods.  This solves
 *   the <A-a> problem, but not <A-c>
 *
 * - When iterating over a group, we keep a tally of which priority group we are
 *   in.  Mods|Keys|Chars.  If we are past the Mods priority grouping, then we know
 *   the character 'a' must be interpreted as a char
 *
 * - If we come across an ambiguous char like a|c, if there is no next, then it MUST
 *   be interpreted as a char and not a mod.
 *
 * - If getGrouping does not add any keys, then we know this grouping in invalid
 *   and the '<' char will no longer be interpreted as a group starter
 */
export function tokenizeKmString(s: string): KeyMap[] | undefined {
    const res = [] as ArrayOnlyKeyMap[];
    let curr = {} as ArrayOnlyKeyMap;

    const pushCurr = () => {
        if (Object.keys(curr).length) res.push(curr);
        curr = {};
    };

    for (let i = 0; i < s.length; ++i) {
        if (s[i] === "<") {
            // Determine the end idx if the grouping is valid.  If its not a valid
            // grouping, then we fallthrough and interpret it as a literal < char
            const eidx = findEidx(s, i + 1);

            if (eidx) {
                const { mods, keys, input } = getGrouping(s, i + 1, eidx);

                // As long as it has modifiers or keys, it **can** be a valid
                // grouping. If it is, it will be converted to a KeyMap and added
                // to the result.  Otherwise, we fall through and default to
                // adding input to the current
                if (mods.size || keys.size) {
                    // Must be either Mod + (Keys || non-special-chars) or
                    // Keys with no input
                    if (
                        (mods.size && (keys.size || input.length)) ||
                        keys.size
                    ) {
                        pushCurr();

                        curr.key = [...mods.values(), ...keys.values()];
                        if (input) curr.input = input;
                        res.push(curr);
                        curr = {};

                        i = eidx;
                        continue;
                    }
                }
            }
        }

        curr.input = curr.input ?? "";
        curr.input += s[i];
    }

    pushCurr();

    return res;
}

/**
 * We need to handle edge cases such as <C-f--o>.  Since f cannnot be interpreted
 * as a Mod (or key), everything after must be a string literal, so if we split
 * on '-' after f, we would lose a -.
 *
 * This does not validate if the grouping is valid.  All it does is interpret the
 * grouping sequence.  The results will tell us if it is valid
 */
function getGrouping(
    s: string,
    sidx: number,
    eidx: number,
): {
    mods: Set<Modifier>;
    keys: Set<Key>;
    input: string;
} {
    // Results
    const mods = new Set<Modifier>();
    const keys = new Set<Key>();
    let input = "";

    // Loop trackers
    let acc = "";
    let priority = 3;
    for (let i = sidx; i <= eidx; ++i) {
        const checkAcc = s[i] === "-" || i === eidx;
        const possibleMod = i !== eidx;

        if (priority > 1 && checkAcc) {
            const upper = acc.toUpperCase();
            const lower = acc.toLowerCase();

            if (priority === 3 && upper in ModMap && possibleMod) {
                if (mods.has(ModMap[upper])) {
                    // Sequence has already used this mod, so we interpret as a char and downgrade priority
                    input += acc;
                    priority = 1;
                } else {
                    mods.add(ModMap[upper]);
                }

                acc = "";
                continue;
            }

            // Priority must be >= 2 here.  We either add a Key, or we downgrade
            // priority so this entire block is never re-executed
            if (KeySet.has(lower as Key) || upper in KeyAliases) {
                priority = 2;
                keys.add(KeyAliases[upper] || lower);

                acc = "";
                continue;
            }

            priority = 1;
        }

        // If there are any straggler acc's, we need to run through the loop
        // again to check them, but we don't want to reaccumulate them.
        if (i < eidx) {
            if (priority === 1) {
                input += s[i];
            } else {
                acc += s[i];
            }
        }
    }

    return {
        mods,
        keys,
        input: input + acc,
    };
}

function findEidx(s: string, sidx: number): null | number {
    let eidx: null | number = null;
    for (let i = sidx; i < s.length; ++i) {
        if (s[i] === ">") {
            eidx = i;
            break;
        }
    }
    return eidx;
}
