export function createCb(msg: string) {
    return () => {
        console.log(`\x1b[033m✔ Executing callback:\x1b[0m\n${msg}\n`);
    };
}
