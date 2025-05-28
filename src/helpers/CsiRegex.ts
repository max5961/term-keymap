/* eslint-disable no-control-regex */

function isKittyProtocol(utf: string) {
    const codeOnlyRegex = /^\x1b\[\d+u/gm;
    const withModifierRegex = /^\x1b\[\d+;\d+u/gm;
    return codeOnlyRegex.test(utf) || withModifierRegex.test(utf);
}

function isMouseEvent(utf: string) {
    const regex = /^\x1b\[<\d+;\d+;\d+[mM]/gm;
    return regex.test(utf);
}

function getMouseEvent(utf: string) {
    const regex = /^\x1b\[<(\d+);(\d+);(\d+)(\w)/;
    return Array.from(regex.exec(utf) ?? []).map((match) => {
        const num = Number(match);
        return Number.isNaN(num) ? match : num;
    });
}

function getKittyWithModifier(utf: string) {
    const regex = /^\x1b\[(\d+);(\d+)(\w+)/gm;
    return regex.exec(utf);
}

function getKittyCharCode(utf: string) {
    const regex = /^\x1b\[(\d+)/gm;
    return regex.exec(utf);
}

export const CsiRegex = {
    isKittyProtocol,
    isMouseEvent,
    getMouseEvent,
    getKittyWithModifier,
    getKittyCharCode,
};
