import { test } from "vitest";

type StartsWithCsi<S extends string> = S extends `\x1b${S}` ? S : never;

/**
 * Similar implementation to test.each but formats the CSI sequence so that it
 * can be printed.
 */
export function testEachCsi<T extends string, R extends unknown[]>({
    tests,
    title,
    cb,
}: {
    tests: [T, ...R][];
    title: (csi: string, ...args: R[]) => string;
    cb: (csi: StartsWithCsi<T>, ...args: R[]) => unknown;
}) {
    for (const testCase of tests) {
        const csi = testCase[0] as StartsWithCsi<T>;
        const printCsi = csi.slice(1);
        const args = testCase.slice(1) as R[];
        const testTitle = title(`\\x1b${printCsi}`, ...args);

        test(testTitle, () => {
            cb(csi, ...args);
        });
    }
}
