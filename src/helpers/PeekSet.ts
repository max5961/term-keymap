export default class PeekSet<T = unknown> extends Set<T> {
    private baseHas: Set<T>["has"];

    constructor(v?: Iterable<T> | null) {
        super(v);
        this.baseHas = new Set().has.bind(this);
    }

    /**
     * Overrides the Set.has method to support multiple arguments
     * @returns *true* if all provided values are present in the set.
     */
    public override has(...args: T[]): boolean {
        return args.every((arg) => this.baseHas(arg));
    }

    /**
     * @returns an arbitrary value from the set, which is the earliest added value
     * in the current state.
     */
    public peek(): T | undefined {
        return Array.from(this.values())[0];
    }

    /**
     * @returns *true* if the set contains *only* the given value.
     */
    public only(value: T): boolean {
        return this.size === 1 && this.baseHas(value);
    }
}
