import type { Data, Key } from "../types.js";
import { parseBuffer } from "../parse/parseBuffer.js";
import PeekSet from "../helpers/PeekSet.js";

type Register = {
    key: PeekSet<Key>;
    input: PeekSet<string>;
};

type Return = {
    parseBuffer: typeof parseBuffer;
    register: Register;
    clearRegister: () => void;
    data: Data;
};

export function createRegister(opts: { size?: number } = {}): Return {
    opts.size = opts.size ?? 2;

    const register: Register = {
        key: new PeekSet(),
        input: new PeekSet(),
    };

    const clearRegister = () => {
        register.key = new PeekSet();
        register.input = new PeekSet();
    };

    const data: Data = {
        raw: {
            buffer: [],
            hex: "",
            utf: "",
        },
        key: new PeekSet(),
        input: new PeekSet(),
    };

    return {
        register,
        clearRegister,
        data,
        parseBuffer: (buf: Buffer) => {
            const parsedData = parseBuffer(buf);

            data.input = parsedData.input;
            data.key = parsedData.key;
            data.raw = parsedData.raw;
            data.mouse = parsedData.mouse;

            for (const v of register.input) {
                if (v.length >= opts.size!) {
                    clearRegister();
                }
            }

            const nextKeys = new PeekSet<Key>(data.key);

            if (
                nextKeys.size !== register.key.size ||
                nextKeys.has("return") ||
                nextKeys.has("tab")
            ) {
                clearRegister();
            } else {
                for (const key of nextKeys) {
                    if (!register.key.has(key as Key)) {
                        clearRegister();
                        break;
                    }
                }
            }

            register.key = nextKeys;

            const setData: string[] = [];
            for (const i of data.input) {
                if (register.input.size) {
                    for (const j of register.input) {
                        setData.push(`${j}${i}`);
                    }
                } else {
                    setData.push(i);
                }
            }
            register.input = new PeekSet(setData);

            return data;
        },
    };
}
