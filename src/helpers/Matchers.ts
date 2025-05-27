export const Matchers = {
    kittyModifier: /^\[(\d+);(\d+)(\w+)/gm,
    kittyNormal: /^\[(\d+)/gm,
    mouseEvent: /^\[<(\d+);(\d+);(\d+)(\w)$/gm,
} as const;
