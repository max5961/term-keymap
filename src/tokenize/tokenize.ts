import type { Key, Modifier, KeyMap } from "../types.js";
import { ModMap, KeyAliases } from "./maps.js";
import { Sets } from "../constants.js";
import { PeekSet } from "../util/PeekSet.js";

export type ArrayOnlyKeyMap = KeyMap & { key?: Key[] };

/**
 * VALID GROUPING RULES - if any of these are not true, we interpret the '<' as
 * the literal char and the grouping becomes a string literal.
 *
 * - The first '>' character closes the grouping
 *
 * - Members of the group (except those discovered during input phase - see rule
 *   below) are separated by '-' chars.
 *
 * - Valid groupings must be ordered in the following way:
 *   Modifiers -> Keys -> Input (non-special-chars)
 *
 * - The group is parsed in 'phases'.  If a member *can* be interpreted as a Modifier,
 *   then it will be, otherwise the phase is downgraded to either Key or Input.
 *
 * - The first member of the sequence must be either a Mod or a Key.  If it is a
 *   Mod, it **must** be paired with something else.  Mods cannot exist alone
 *
 * - Modifiers and Keys can be of any casing
 *
 * - A group is considered *invalid* if it consists of only a single Modifer,
 *   only non-special-chars, or only Keys mixed w/ non-special-chars.
 *
 * - If `getGroup` generates a group not deemed valid, it is gc'd and we
 *   interpret the group as a string literal.  By design, there are no errors
 *   or warnings.  While '<<C-a>' is probably a typo, its possible that the person
 *   mapping it wanted that literally.
 *
 * GROUPING EDGE CASES TO CONSIDER
 *
 * - Modifiers are represented by single characters and can be upper or
 *   lowercase. This means that <A-a> could be interpreted as Alt + Alt but
 *   what we want is Alt + 'a'. Because of this, once we parse a possible
 *   modifier we have already stored, we immediately shift into Input phase
 *
 * - A grouping that ends in Modifier Phase with a modifier must be interpreted
 *   as the literal char to allow for mappings that could otherwise be interpreted
 *   as Mod + Mod.  i.e.: `<C-A>` should be `Ctrl + A`, not `Ctrl + Alt`
 */
export function tokenize(s: string): KeyMap[] {
    const res = [] as ArrayOnlyKeyMap[];
    let curr = {} as ArrayOnlyKeyMap;

    const pushCurr = () => {
        if (Object.keys(curr).length) res.push(curr);
        curr = {};
    };

    for (let i = 0; i < s.length; ++i) {
        if (s[i] === "<") {
            // Returns null if there is no closing tag
            const eidx = findEidx(s, i + 1);

            if (eidx) {
                const { mods, keys, input } = getGrouping(s, i + 1, eidx);

                // If mods or keys, it **can** be a valid grouping.  If it is,
                // convert it to a KeyMap and push to the results.  If invalid, the
                // '<' treated as any other character and the grouping becomes a string
                // literal
                if (mods.size || keys.size) {
                    let schedulePush = false;

                    if (keys.only("leader") && !mods.size && !input.length) {
                        pushCurr();
                        curr.leader = true;
                        schedulePush = true;
                    }

                    if (!keys.has("leader")) {
                        if (
                            (mods.size && (keys.size || input.length)) ||
                            (keys.size && !input.length)
                        ) {
                            pushCurr();

                            curr.key = [
                                ...(mods.values() as SetIterator<Key>),
                                ...(keys.values() as SetIterator<Key>),
                            ];
                            if (input) curr.input = input;
                            schedulePush = true;
                        }
                    }

                    if (schedulePush) {
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

/** Phase Enum */
const P = {
    /** Modifier Phase */
    Mod: 3,
    /** Key Phase */
    Key: 2,
    /** Input Phase (non-special-chars) */
    Input: 1,
} as const;

/**
 * The generates a grouping regardless of its validity. The validity of the result
 * should be determined before its use.
 */
function getGrouping(
    s: string,
    sidx: number,
    eidx: number,
): {
    mods: PeekSet<Modifier>;
    keys: PeekSet<Key | "leader">;
    input: string;
} {
    // Results
    const mods = new PeekSet<Modifier>();
    const keys = new PeekSet<Key | "leader">();
    let input = "";

    // Loop Trackers
    let acc = "";
    let phase = P.Mod as number;
    for (let i = sidx; i <= eidx; ++i) {
        const checkAcc = s[i] === "-" || i === eidx;
        const possibleMod = i !== eidx;

        if (phase > P.Input && checkAcc) {
            const upper = acc.toUpperCase();
            const lower = acc.toLowerCase();

            if (phase === P.Mod && upper in ModMap && possibleMod) {
                if (mods.has(ModMap[upper])) {
                    // The grouping already contains this Mod.  Interpret the Mod
                    // and hyphen as if we are in Input Phase
                    input += acc += "-";
                    phase = P.Input;
                } else {
                    mods.add(ModMap[upper]);
                }

                acc = "";
                continue;
            }

            // Phase must be >= 2 here.
            if (
                Sets.Keys.has(lower as Key) ||
                upper in KeyAliases ||
                lower === "leader"
            ) {
                phase = P.Key;
                keys.add(KeyAliases[upper] || lower);

                acc = "";
                continue;
            }

            // Key check failed, so we must be in Input Phase
            phase = P.Input;
            input += acc;
            acc = "";
        }

        // NOTE: for loop iterates to `<= eidx` to force an extra loop and handle
        // possible acc chunks that could be Keys.
        if (i < eidx) {
            if (phase === P.Input) {
                input += s[i];
            } else {
                acc += s[i];
            }
        }
    }

    return {
        mods,
        keys,
        input,
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
