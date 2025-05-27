export const Matchers = {
    get kittyModifier() {
        return new RegExp(/^\[(\d+);(\d+)(\w+)/gm);
    },
    get kittyNormal() {
        return new RegExp(/^\[(\d+)/gm);
    },
    get mouseEvent() {
        return new RegExp(/^\[<(\d+);(\d+);(\d+)(\w)/);
    },
} as const;
