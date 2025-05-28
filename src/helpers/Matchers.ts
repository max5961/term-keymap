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
    get isKittyEventSingle() {
        return new RegExp(/^\[\d+u/gm);
    },
    get isKittyEventDbl() {
        return new RegExp(/^\[\d+;\d+u/gm);
    },
} as const;
