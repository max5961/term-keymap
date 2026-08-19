import type { Key, KeyMap } from "../types.js";

// key.ctrl.alt.input("foo").ctrl.input("bar") => [{ key: ["ctrl", "alt"], input: "foo"}, {key: "ctrl", input: "bar"}]

export interface IKeyHelper {
    readonly ctrl: KeyMapCreator;
    readonly alt: KeyMapCreator;
    f1(): KeyMapCreator;
    input(input: string): KeyMapCreator;
}

export class KeyMapCreator implements IKeyHelper {
    protected keys: Set<Key>;
    protected mods: Set<Key>;
    protected sections: KeyMap[];

    constructor(
        keys: Set<Key> = new Set(),
        mods: Set<Key> = new Set(),
        sections: KeyMap[] = [],
    ) {
        this.keys = keys;
        this.mods = mods;
        this.sections = sections;
    }

    /** @internal */
    public _readFullKeyMap() {
        const token = this.sections;
        this.keys = new Set();
        this.mods = new Set();
        this.sections = [];
        return token;
    }

    private _readSection(input?: string) {
        const section: KeyMap = {};

        if (input !== undefined) {
            section.input = input;
        }

        // Even though its illegal/impossible to combine non-mod keys with alphanumerics,
        // we still need the section to be truthful so that it doesn't match an
        // unintended keymap
        if (this.mods.size || this.keys.size) {
            section.key = [...this.mods.values(), ...this.keys.values()];
        }
        this.sections.push(section);

        this.keys = new Set();
        this.mods = new Set();
    }

    get ctrl() {
        this.mods.add("ctrl");
        return this;
    }

    get alt() {
        this.mods.add("alt");
        return this;
    }

    public f1() {
        this.keys.add("f1");
        this._readSection();
        return this;
    }

    public input(input: string) {
        this._readSection(input);
        return this;
    }
}

export class KeyMapCreatorStarter implements IKeyHelper {
    constructor() {}

    get ctrl() {
        return new KeyMapCreator().ctrl;
    }
    get alt() {
        return new KeyMapCreator().alt;
    }
    public f1() {
        return new KeyMapCreator().f1();
    }
    public input(input: string) {
        return new KeyMapCreator().input(input);
    }
}

export const key = new KeyMapCreatorStarter();

// for now though...
export const keymap = () => new KeyMapCreator();
