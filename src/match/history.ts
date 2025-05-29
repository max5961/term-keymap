import type { Data } from "../types.js";
import { CircularQueue } from "./CircularQueue.js";
import { match, type KeyMap } from "./match.js";

export function history() {
    const q = new CircularQueue<Data>(50);

    const update = (data: Data) => {
        q.enqueue(data);
    };

    const checkMatch = (keymaps: KeyMap[]) => {
        const sorted: Record<number, Record<number, KeyMap[]>> = {};

        keymaps.forEach((km) => {
            const inputLength = km.input?.length ?? 0;
            const keyLength = km.key?.length ?? 0;

            if (!sorted[inputLength]) {
                sorted[inputLength] = {};
            }
            if (!sorted[inputLength][keyLength]) {
                sorted[inputLength][keyLength] = [];
            }

            sorted[inputLength][keyLength].push(km);
        });

        const sortedInputLengths = Object.keys(sorted)
            .map((s) => Number(s))
            .sort();

        sortedInputLengths.forEach((inputIdx) => {
            const sortedKeyLengths = Object.keys(sorted[inputIdx])
                .map((s) => Number(s))
                .sort();

            sortedKeyLengths.forEach((keyIdx) => {
                const arr = (sorted[inputIdx]?.[keyIdx] ?? []) as KeyMap[];

                arr.forEach((km) => {
                    console.log(km);
                    // if (match()) {
                    //     return km;
                    // }
                });
            });
        });
    };

    return { update, checkMatch };
}
