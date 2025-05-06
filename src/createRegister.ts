import type { Data, Key } from "./Data.js";
import { parseBuffer } from "./parseBuffer.js";

type Register = {
    key: Set<Key>;
    input: Set<string>;
    defaultInput: string;
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
        key: new Set(),
        input: new Set(),
        get defaultInput() {
            for (const v of this.input) return v;
            return "";
        },
    };

    const clearRegister = () => {
        register.key = new Set();
        register.input = new Set();
    };

    const data: Data = {
        raw: {
            buffer: Buffer.from([]),
            hex: "",
            utf: "",
        },
        key: {},
        input: new Set(),
        get defaultInput(): string {
            for (const value of this.input.values()) return value;
            return "";
        },
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

            const nextKeys = new Set<Key>();
            for (const [k, v] of Object.entries(data.key)) {
                if (v) nextKeys.add(k as Key);
            }

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
            register.input = new Set(setData);

            return data;
        },
    };
}
