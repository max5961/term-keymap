/* eslint-disable no-control-regex */

export type Encoding = "kitty" | "legacy" | "xterm" | "mouse";
export class Decode {
    private static Rgx = {
        Kitty: {
            /**
             * @example
             * \x1b[97;4u
             */
            get withMods() {
                return /^\x1b\[(\d+);(\d+)u/;
            },
            /**
             * @example
             * \x1b[97u
             */
            get woMods() {
                return /^\x1b\[(\d+)u/;
            },
        },
        Legacy: {
            /**
             * @example
             * \x1b[17;5~
             * \x1b[1;3A
             */
            get numWithMod() {
                return /^\x1b\[(\d+);(\d+)([~ABCDEFHPQRS])/;
            },
            /**
             * @example
             * \x1b[17~
             */
            get numOnly() {
                return /^\x1b\[(\d+)(~)/;
            },
            /**
             * @example
             * \x1b[A
             */
            get letterOnly() {
                return /^\x1b\[([ABCDEFHPQRS])/;
            },

            /**
             * @example
             * \x1b[OP
             */
            get ss3() {
                return /^\x1b(O)([ABCDEFHPQRS~])/;
            },
        },
        /**
         * @example
         * \x1b[<35;5;10M
         */
        get Mouse() {
            return /^\x1b\[<(\d+);(\d+);(\d+)([mM])/;
        },
    };

    private static isKittyEncoded = (utf: string): boolean => {
        return (
            this.Rgx.Kitty.woMods.test(utf) || this.Rgx.Kitty.withMods.test(utf)
        );
    };

    public static getKittyCaptures = (utf: string) => {
        // prettier-ignore
        return Array.from(
            this.Rgx.Kitty.withMods.exec(utf) ||
            this.Rgx.Kitty.woMods.exec(utf) ||
            []
        )
            .slice(1)
            .map(m => Number(m));
    };

    private static isLegacyEncoded = (utf: string): boolean => {
        return (
            this.Rgx.Legacy.numWithMod.test(utf) ||
            this.Rgx.Legacy.numOnly.test(utf) ||
            this.Rgx.Legacy.letterOnly.test(utf) ||
            this.Rgx.Legacy.ss3.test(utf)
        );
    };

    public static getLegacyCaptures = (utf: string) => {
        // prettier-ignore
        return Array.from(
            this.Rgx.Legacy.letterOnly.exec(utf) ||
            this.Rgx.Legacy.ss3.exec(utf) ||
            this.Rgx.Legacy.numOnly.exec(utf) ||
            this.Rgx.Legacy.numWithMod.exec(utf) ||
            [],
        )
            .slice(1)
            .map(m => {
                const num = Number(m);
                return Number.isNaN(num) ? m : num;
            })
    };

    private static isMouseEncoded = (utf: string): boolean => {
        return this.Rgx.Mouse.test(utf);
    };

    public static getMouseCaptures = (utf: string) => {
        // prettier-ignore
        return Array.from(
            this.Rgx.Mouse.exec(utf) ||
            []
        )
            .slice(1)
            .map(m => {
                const num = Number(m)
                return Number.isNaN(num) ? m : num;
            })
    };

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
}
