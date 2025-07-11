import { type KeyMap } from "../stateful/match.js";
import { type Key } from "../types.js";
import { ModMap, KeySet, KeyAliases } from "./helpers.js";

export type ArrayOnlyKeyMap = KeyMap & { key?: Key[] };

export function tokenizeKmString(
    s: string,
    opts: { verbose?: boolean } = {},
): KeyMap[] | undefined {
    opts.verbose = opts.verbose ?? false;

    const km: ArrayOnlyKeyMap[] = [];
    let curr: ArrayOnlyKeyMap = {};

    for (let i = 0; i < s.length; ++i) {
        const char = s[i];
        if (char === "<" && getEidx(s, i + 1)) {
            if (Object.keys(curr).length) {
                km.push(curr);
            }
            curr = {};

            const eidx = getEidx(s, i + 1);
            const seq = s.slice(i + 1, eidx).split("-");
            i = eidx;

            let adddedNonMod = false;
            for (const c of seq) {
                if (c in ModMap && adddedNonMod) {
                    if (opts.verbose) {
                        console.warn(
                            `Invalid mod order: Modifier '${ModMap[c]}' appears after keys/characters.  ModMap must always appear first in <> sequences`,
                        );
                    }
                    return undefined;
                }

                const cupper = c.toUpperCase();
                const clower = c.toLowerCase();

                if (cupper in ModMap) {
                    curr.key = curr.key ?? [];
                    curr.key.push(ModMap[cupper]);
                } else if (cupper in KeyAliases) {
                    curr.key = curr.key ?? [];
                    curr.key.push(KeyAliases[cupper]);
                    adddedNonMod = true;
                } else if (KeySet.has(clower as Key)) {
                    curr.key = curr.key ?? [];
                    curr.key.push(clower as Key);
                    adddedNonMod = true;
                } else if (char) {
                    curr.input = curr.input ?? "";
                    curr.input += c;
                    adddedNonMod = true;
                }
            }

            km.push(curr);
            curr = {};
        } else if (char) {
            curr.input = curr.input ?? "";
            curr.input += char;
        }
    }

    if (curr !== km[km.length - 1] && Object.keys(curr).length) {
        km.push(curr);
    }

    return km;
}

/**
 * This needs to be able to guard against <C-foo<CR> which should favor the
 * later key seq.  So if we get to another <[^<]* we return 0
 */
function getEidx(s: string, sidx: number) {
    for (let i = sidx; i < s.length; ++i) {
        if (s[i] === "<" && s[i + 1] !== "<") {
            return i;
        }
        if (s[i] === ">") {
            return i;
        }
    }

    // Incomplete <>, so we should treat < as a literal
    return 0;
}

// function getModSeqData(
//     s: string,
//     eidx: number,
//     sidx: number,
// ): { key: Key[]; input?: string } {
//     let acc = "";
//     for (let i = 0; i < eidx; ++i) {
//         acc += s[i];
//     }
// }
