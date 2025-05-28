function isKittyProtocol(utf: string) {
    const codeOnlyRegex = /^\x1b\[\d+u/gm;
    const withModifierRegex = /^\x1b\[\d+;\d+u/gm;
    return codeOnlyRegex.test(utf) || withModifierRegex.test(utf);
}

function isMouseEvent(utf: string) {
    const regex = /^\x1b\[<\d+;\d+;\d+[mM]/gm;
    return regex.test(utf);
}

export const Testers = {
    isKittyProtocol,
    isMouseEvent,
};
