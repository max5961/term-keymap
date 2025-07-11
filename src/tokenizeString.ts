import { type KeyMap } from "./stateful/match.js";
import { type Modifier, type Key } from "./types.js";

export const Mods: Record<string, Modifier> = {
    C: "ctrl",
    A: "alt",
    D: "super",
    M: "meta",
    H: "hyper",
} as const;

export const Keys: Set<Key> = new Set([
    "ctrl",
    "alt",
    "shift",
    "super",
    "hyper",
    "meta",
    "capsLock",
    "numLock",
    "backspace",
    "delete",
    "esc",
    "insert",
    "return",
    "tab",
    "up",
    "down",
    "left",
    "right",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "f10",
    "f11",
    "f12",
    "f13",
    "f14",
    "f15",
    "f16",
    "f17",
    "f18",
    "f19",
    "f20",
    "f21",
    "f22",
    "f23",
    "f24",
    "f25",
    "f26",
    "f27",
    "f28",
    "f29",
    "f30",
    "f31",
    "f32",
    "f33",
    "f34",
    "f35",
    "pageUp",
    "pageDown",
    "home",
    "end",
    "scrollLock",
    "printScreen",
    "begin",
    "pause",
    "menu",
    "mediaPlay",
    "mediaPause",
    "mediaPlayPause",
    "mediaReverse",
    "mediaStop",
    "mediaFastForward",
    "mediaRewind",
    "mediaTrackNext",
    "mediaTrackPrevious",
    "mediaRecord",
    "mediaLowerVolume",
    "mediaRaiseVolume",
    "mediaMuteVolume",
]);

export type ArrayOnlyKeyMap = KeyMap & { key?: Key[] };

export function tokenizeString(
    s: string,
    opts: { verbose?: boolean } = {},
): KeyMap[] | undefined {
    const km: ArrayOnlyKeyMap[] = [];

    let curr: ArrayOnlyKeyMap = {};
    for (let i = 0; i < s.length; ++i) {
        const char = s[i];
        if (char === "<") {
            if (Object.keys(curr).length) {
                km.push(curr);
            }
            curr = {};

            const eidx = getEidx(s, i + 1);
            const seq = s.slice(i + 1, eidx).split("-");
            i = eidx;

            let adddedNonMod = false;
            for (const c of seq) {
                if (c in Mods && adddedNonMod) {
                    if (opts.verbose) {
                        console.warn(
                            `Invalid mod order: Modifier '${Mods[c]}' appears after keys/characters.  Mods must always appear first in <> sequences`,
                        );
                    }
                    return undefined;
                }

                if (c in Mods) {
                    curr.key = curr.key ?? [];
                    curr.key.push(Mods[c]);
                } else if (Keys.has(c.toLowerCase() as Key)) {
                    curr.key = curr.key ?? [];
                    curr.key.push(c.toLowerCase() as Key);
                    adddedNonMod = true;
                } else {
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

function getEidx(s: string, sidx: number) {
    for (let i = sidx; i < s.length; ++i) {
        if (s[i] === ">" && s[i + 1] !== ">") {
            return i;
        }
    }

    return s.length - 1;
}
