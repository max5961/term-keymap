import type { Data, MouseEvent } from "../types.js";

export const TestEnv = { current: false };

export class MousePosition {
    // eslint-disable-next-line no-control-regex
    private static readonly CursorPositionRegex = /\x1b\[(\d+);\d+R/;
    private static readonly QueryCursorPosition = "\u001B[6n";
    private listeners = new Set<(y: number) => unknown>();

    /**
     * Resolves the `MouseEvent.clientX` and `MouseEvent.clientY` to the TUI's layout
     * regardless of if it is in fullscreen or not.
     *
     * This function assumes that the cursor is stored at the bottom row when not
     * writing to stdout.  If the position cannot be resolved because the term
     * does not support querying for the cursor position, then the Promise returns
     * `undefined`.
     * */
    public resolve(
        events: MouseEvent[],
        wasQueryResults: boolean,
        layoutHeight: number,
        stdout: NodeJS.WriteStream & { fd: 1 },
    ): Promise<MouseEvent[] | undefined> {
        if (stdout.rows === layoutHeight || !events.length || wasQueryResults) {
            return Promise.resolve(events);
        }

        return new Promise<number>((res, rej) => {
            const timeoutID = setTimeout(() => {
                rej(-1);
                this.listeners.delete(resolve);
            }, 10);

            const resolve = (y: number) => {
                res(y);
                clearTimeout(timeoutID);
                this.listeners.delete(resolve);
            };

            this.listeners.add(resolve);

            if (!TestEnv.current) {
                stdout.write(MousePosition.QueryCursorPosition);
            }
        })
            .then((cursorRow) => {
                const yoffset = cursorRow - layoutHeight + 1;
                return events.map((e) => {
                    e.clientY -= yoffset;
                    if (e.type === "drag" || e.type === "dragend") {
                        e.dragStartY -= yoffset;
                    }
                    return e;
                });
            })
            .catch(() => {
                // cursor position could not be queried, so undefined is
                // returned because the clientX/clientY positions will not be valid
                return undefined;
            });
    }

    /**
     * Checks if the data being sent over is from a cursor position query and if
     * it is, resolves the Promise that sent the query.
     */
    public checkQueryAndResolve(utf: string) {
        const match = utf.match(MousePosition.CursorPositionRegex);
        if (!match) return false;

        const y = Number(match[1]) - 1;
        this.listeners.forEach((listener) => listener(y));
        return true;
    }
}
