import { describe, test, expect, beforeEach } from "vitest";
import { CircularQueue } from "../src/stateful/CircularQueue.js";

describe("CircularQueue", () => {
    const q = new CircularQueue<number>(5);

    // prettier-ignore
    test.each([
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8],
        [9],
    ])("Enqueue and tail %i", (num) => {
        q.enqueue(num);
        expect(q.tail()).toBe(num);
    })

    test("Size does not exceed size provided by constructor", () => {
        expect(q.size).toBe(5);
    });

    test("q.forEach", () => {
        let i = 9;
        let j = 0;
        q.forEach((item, k) => {
            expect(item).toBe(i--);
            expect(k).toBe(j++);
        });
    });

    test.each([
        [0, 9],
        [1, 8],
        [2, 7],
        [3, 6],
        [4, 5],
    ])("from tail(%i) is %i", (from, is) => {
        expect(q.fromTail(from)).toBe(is);
    });

    test("fromTail(<greater than or equal to max size>) is undefined", () => {
        expect(q.fromTail(5)).toBe(undefined);
    });

    describe("q.clear()", () => {
        beforeEach(() => q.clear());

        test("q.size after q.clear() is 0", () => {
            expect(q.size).toBe(0);
        });
        test("q.tail after q.clear() is undefined", () => {
            expect(q.tail()).toBe(undefined);
        });
        test("q.fromTail(0) after q.clear() is undefined", () => {
            expect(q.fromTail(0)).toBe(undefined);
        });
    });
});
