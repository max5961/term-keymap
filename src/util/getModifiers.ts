/**
 * Returns an object representing the bit field of the modifier value.  Do *not*
 * decrement the modifier value, since this function handles that.
 */
export function getModifiers(num: number | undefined) {
    num = (num ?? 1) - 1;
    num = Number.isNaN(num) ? 0 : num;
    return {
        shift: (num & 1) !== 0,
        alt: (num & 2) !== 0,
        ctrl: (num & 4) !== 0,
        super: (num & 8) !== 0,
        hyper: (num & 16) !== 0,
        meta: (num & 32) !== 0,
        capsLock: (num & 64) !== 0,
        numLock: (num & 128) !== 0,
    } as const;
}

export type Modifiers = keyof ReturnType<typeof getModifiers>;
