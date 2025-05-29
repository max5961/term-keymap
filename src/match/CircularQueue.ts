export class CircularQueue<T> {
    private maxSize: number;
    private start!: number;
    private end!: number;
    private map!: Map<number, T>;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
        this.clear();
    }

    public get size(): number {
        return this.end - this.start;
    }

    public clear(): void {
        this.start = 0;
        this.end = 0;
        this.map = new Map();
    }

    public enqueue(item: T): void {
        this.map.set(this.end++, item);

        if (this.size > this.maxSize) {
            this.dequeue();
        }
    }

    private dequeue(): void {
        this.map.delete(this.start++);
    }

    public peek(idx: number): T | undefined {
        return this.map.get(idx);
    }

    /**
     * Reverse iterates the queue (latest to earliest added)
     * */
    public forEach(cb: (item: T) => unknown): void {
        for (let i = this.end - 1; i >= this.start; --i) {
            const item = this.peek(i);
            if (item) cb(item);
        }
    }
}
