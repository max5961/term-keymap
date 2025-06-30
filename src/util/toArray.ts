export function toArray<T>(val: T | T[]) {
    if (Array.isArray(val)) return val;
    return [val];
}
