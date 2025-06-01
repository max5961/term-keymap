/* eslint-disable no-control-regex */

import type { Key } from "../types.js";

export type Encoding = "kitty" | "legacy" | "xterm" | "mouse";
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

export class Decode {
    private static isKittyEncoded(utf: string): boolean {
        const codeOnly = /^\x1b\[\d+u/g;
        const withModifier = /^\x1b\[\d+;\d+u/g;

        return codeOnly.test(utf) || withModifier.test(utf);
    }

    private static isLegacyEncoded(utf: string): boolean {
        const numWithMod = /^\x1b\[\d+;\d+[~ABCDEFHPQRS]/g;
        const numOnly = /^\x1b\[\d+~/g;
        const letterOnly = /^\x1b\[[ABCDEFHPQRS]/g;
        const ss3 = /^\x1b[O][ABCDEFHPQRS~]/g;

        return (
            numWithMod.test(utf) ||
            numOnly.test(utf) ||
            letterOnly.test(utf) ||
            ss3.test(utf)
        );
    }

    private static isMouseEncoded(utf: string): boolean {
        const regex = /^\x1b\[<\d+;\d+;\d+[mM]/;
        return regex.test(utf);
    }

    /**
     * Kitty:
     *     - `CSI number ; modifier u` | `CSI number u`
     * Legacy *(supported by kitty)*:
     *     - `CSI number ; modifier {~ABCDEFHPQRS}`
     *     - `CSI number ~`
     *     - `CSI {ABCDEFHPQRS}`
     *     - `CSI O {ABCDEFHPQRS}`
     * Mouse:
     *     - `CSI < event x y [Mm]` where lowercase m indicates release event
     * Xterm:
     *     - Non CSI *(\x1b[)* encoded
     * */
    public static getEncoding(utf: string): Encoding {
        if (Decode.isKittyEncoded(utf)) return "kitty";
        if (Decode.isMouseEncoded(utf)) return "mouse";
        if (Decode.isLegacyEncoded(utf)) return "legacy";
        return "xterm";
    }

    public static get LetterMap(): Record<LetterKey, Key> {
        return {
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
    }
}
