import { describe, test, expect } from "vitest";
import { CircularQueue } from "../src/match/CircularQueue.js";

describe("CircularQueue", () => {
    test("public: enqueue, forEach, size, tail", () => {
        const q = new CircularQueue<number>(5);

        q.enqueue(0);
        q.enqueue(1);
        q.enqueue(2);
        q.enqueue(3);
        q.enqueue(4);
        q.enqueue(5);
        q.enqueue(6);
        q.enqueue(7);
        q.enqueue(8);
        q.enqueue(9);

        expect(q.size).toBe(5);

        let i = 9;
        let j = 0;
        q.forEach((item, k) => {
            expect(item).toBe(i--);
            expect(k).toBe(j++);
        });

        expect(q.tail()).toBe(9);

        q.clear();
        expect(q.size).toBe(0);
        expect(q.tail()).toBe(undefined);
    });
});
