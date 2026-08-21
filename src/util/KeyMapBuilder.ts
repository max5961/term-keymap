import { LEADER } from "../stateful/ActionStore.js";
import type { Key, KeyMap, RawKeyMap } from "../types.js";

export interface IKeyMapBuilder {
    input(input: string): BaseKeyMapBuilder;
    readonly leader: LeaderKeyMapBuilder;
    readonly ctrl: BaseKeyMapBuilder;
    readonly alt: BaseKeyMapBuilder;
    readonly meta: BaseKeyMapBuilder;
    readonly super: BaseKeyMapBuilder;
    readonly hyper: BaseKeyMapBuilder;
    readonly f1: BaseKeyMapBuilder;
    readonly f2: BaseKeyMapBuilder;
    readonly f3: BaseKeyMapBuilder;
    readonly f4: BaseKeyMapBuilder;
    readonly f5: BaseKeyMapBuilder;
    readonly f6: BaseKeyMapBuilder;
    readonly f7: BaseKeyMapBuilder;
    readonly f8: BaseKeyMapBuilder;
    readonly f9: BaseKeyMapBuilder;
    readonly f10: BaseKeyMapBuilder;
    readonly f11: BaseKeyMapBuilder;
    readonly f12: BaseKeyMapBuilder;
    readonly f13: BaseKeyMapBuilder;
    readonly f14: BaseKeyMapBuilder;
    readonly f15: BaseKeyMapBuilder;
    readonly f16: BaseKeyMapBuilder;
    readonly f17: BaseKeyMapBuilder;
    readonly f18: BaseKeyMapBuilder;
    readonly f19: BaseKeyMapBuilder;
    readonly f20: BaseKeyMapBuilder;
    readonly f21: BaseKeyMapBuilder;
    readonly f22: BaseKeyMapBuilder;
    readonly f23: BaseKeyMapBuilder;
    readonly f24: BaseKeyMapBuilder;
    readonly f25: BaseKeyMapBuilder;
    readonly f26: BaseKeyMapBuilder;
    readonly f27: BaseKeyMapBuilder;
    readonly f28: BaseKeyMapBuilder;
    readonly f29: BaseKeyMapBuilder;
    readonly f30: BaseKeyMapBuilder;
    readonly f31: BaseKeyMapBuilder;
    readonly f32: BaseKeyMapBuilder;
    readonly f33: BaseKeyMapBuilder;
    readonly f34: BaseKeyMapBuilder;
    readonly f35: BaseKeyMapBuilder;
    readonly backspace: BaseKeyMapBuilder;
    readonly delete: BaseKeyMapBuilder;
    readonly esc: BaseKeyMapBuilder;
    readonly insert: BaseKeyMapBuilder;
    readonly return: BaseKeyMapBuilder;
    readonly tab: BaseKeyMapBuilder;
    readonly up: BaseKeyMapBuilder;
    readonly down: BaseKeyMapBuilder;
    readonly left: BaseKeyMapBuilder;
    readonly right: BaseKeyMapBuilder;
    readonly pageUp: BaseKeyMapBuilder;
    readonly pageDown: BaseKeyMapBuilder;
    readonly home: BaseKeyMapBuilder;
    readonly end: BaseKeyMapBuilder;
    readonly scrollLock: BaseKeyMapBuilder;
    readonly printScreen: BaseKeyMapBuilder;
    readonly begin: BaseKeyMapBuilder;
    readonly pause: BaseKeyMapBuilder;
    readonly menu: BaseKeyMapBuilder;
    readonly mediaPlay: BaseKeyMapBuilder;
    readonly mediaPause: BaseKeyMapBuilder;
    readonly mediaPlayPause: BaseKeyMapBuilder;
    readonly mediaReverse: BaseKeyMapBuilder;
    readonly mediaStop: BaseKeyMapBuilder;
    readonly mediaFastForward: BaseKeyMapBuilder;
    readonly mediaRewind: BaseKeyMapBuilder;
    readonly mediaTrackNext: BaseKeyMapBuilder;
    readonly mediaTrackPrevious: BaseKeyMapBuilder;
    readonly mediaRecord: BaseKeyMapBuilder;
    readonly mediaLowerVolume: BaseKeyMapBuilder;
    readonly mediaRaiseVolume: BaseKeyMapBuilder;
    readonly mediaMuteVolume: BaseKeyMapBuilder;
}

export abstract class BaseKeyMapBuilder implements IKeyMapBuilder {
    protected keys: Set<Key>;
    protected mods: Set<Key>;
    protected abstract sections: (KeyMap | RawKeyMap)[];
    protected abstract readSections: (KeyMap | RawKeyMap)[] | undefined;

    constructor(
        keys: Set<Key> = new Set(),
        mods: Set<Key> = new Set(),
        // sections: KeyMap[] = [],
    ) {
        this.keys = keys;
        this.mods = mods;
        // this.sections = sections;
    }

    /** @internal
     * Once read/chaining is done, the instance essentially becomes immutable.
     * */
    public abstract $$read(): KeyMap[] | RawKeyMap[];

    protected $$readHelper(): KeyMap[] | RawKeyMap[] {
        if (this.readSections) {
            return this.readSections;
        }
        this.readSections = [...this.sections];
        return this.readSections;
    }

    private pushSection(input?: string) {
        const section: KeyMap = {};

        if (input?.[0] !== undefined) {
            section.input = input[0];
        }

        if (this.mods.size || this.keys.size) {
            section.key = [...this.mods.values(), ...this.keys.values()];
        }

        if (section.input || section.key) {
            this.sections.push(section);
        }

        if (input && input.length > 1) {
            this.pushSection(input.slice(1));
        }

        this.keys = new Set();
        this.mods = new Set();
    }

    public input(input: string) {
        this.pushSection(input);
        return this;
    }

    get leader(): LeaderKeyMapBuilder {
        this.pushSection();
        this.sections.push(LEADER);
        if (this instanceof LeaderKeyMapBuilder) {
            return this;
        }
        return new LeaderKeyMapBuilder(this.sections);
    }

    get ctrl() {
        this.mods.add("ctrl");
        return this;
    }
    get alt() {
        this.mods.add("alt");
        return this;
    }
    get meta() {
        this.mods.add("meta");
        return this;
    }
    get super() {
        this.mods.add("super");
        return this;
    }
    get hyper() {
        this.mods.add("hyper");
        return this;
    }

    get f1() {
        this.keys.add("f1");
        this.pushSection();
        return this;
    }
    get f2() {
        this.keys.add("f2");
        this.pushSection();
        return this;
    }
    get f3() {
        this.keys.add("f3");
        this.pushSection();
        return this;
    }
    get f4() {
        this.keys.add("f4");
        this.pushSection();
        return this;
    }
    get f5() {
        this.keys.add("f5");
        this.pushSection();
        return this;
    }
    get f6() {
        this.keys.add("f6");
        this.pushSection();
        return this;
    }
    get f7() {
        this.keys.add("f7");
        this.pushSection();
        return this;
    }
    get f8() {
        this.keys.add("f8");
        this.pushSection();
        return this;
    }
    get f9() {
        this.keys.add("f9");
        this.pushSection();
        return this;
    }
    get f10() {
        this.keys.add("f10");
        this.pushSection();
        return this;
    }
    get f11() {
        this.keys.add("f11");
        this.pushSection();
        return this;
    }
    get f12() {
        this.keys.add("f12");
        this.pushSection();
        return this;
    }
    get f13() {
        this.keys.add("f13");
        this.pushSection();
        return this;
    }
    get f14() {
        this.keys.add("f14");
        this.pushSection();
        return this;
    }
    get f15() {
        this.keys.add("f15");
        this.pushSection();
        return this;
    }
    get f16() {
        this.keys.add("f16");
        this.pushSection();
        return this;
    }
    get f17() {
        this.keys.add("f17");
        this.pushSection();
        return this;
    }
    get f18() {
        this.keys.add("f18");
        this.pushSection();
        return this;
    }
    get f19() {
        this.keys.add("f19");
        this.pushSection();
        return this;
    }
    get f20() {
        this.keys.add("f20");
        this.pushSection();
        return this;
    }
    get f21() {
        this.keys.add("f21");
        this.pushSection();
        return this;
    }
    get f22() {
        this.keys.add("f22");
        this.pushSection();
        return this;
    }
    get f23() {
        this.keys.add("f23");
        this.pushSection();
        return this;
    }
    get f24() {
        this.keys.add("f24");
        this.pushSection();
        return this;
    }
    get f25() {
        this.keys.add("f25");
        this.pushSection();
        return this;
    }
    get f26() {
        this.keys.add("f26");
        this.pushSection();
        return this;
    }
    get f27() {
        this.keys.add("f27");
        this.pushSection();
        return this;
    }
    get f28() {
        this.keys.add("f28");
        this.pushSection();
        return this;
    }
    get f29() {
        this.keys.add("f29");
        this.pushSection();
        return this;
    }
    get f30() {
        this.keys.add("f30");
        this.pushSection();
        return this;
    }
    get f31() {
        this.keys.add("f31");
        this.pushSection();
        return this;
    }
    get f32() {
        this.keys.add("f32");
        this.pushSection();
        return this;
    }
    get f33() {
        this.keys.add("f33");
        this.pushSection();
        return this;
    }
    get f34() {
        this.keys.add("f34");
        this.pushSection();
        return this;
    }
    get f35() {
        this.keys.add("f35");
        this.pushSection();
        return this;
    }
    get backspace() {
        this.keys.add("backspace");
        this.pushSection();
        return this;
    }
    get delete() {
        this.keys.add("delete");
        this.pushSection();
        return this;
    }
    get esc() {
        this.keys.add("esc");
        this.pushSection();
        return this;
    }
    get insert() {
        this.keys.add("insert");
        this.pushSection();
        return this;
    }
    get return() {
        this.keys.add("return");
        this.pushSection();
        return this;
    }
    get tab() {
        this.keys.add("tab");
        this.pushSection();
        return this;
    }
    get up() {
        this.keys.add("up");
        this.pushSection();
        return this;
    }
    get down() {
        this.keys.add("down");
        this.pushSection();
        return this;
    }
    get left() {
        this.keys.add("left");
        this.pushSection();
        return this;
    }
    get right() {
        this.keys.add("right");
        this.pushSection();
        return this;
    }
    get pageUp() {
        this.keys.add("pageUp");
        this.pushSection();
        return this;
    }
    get pageDown() {
        this.keys.add("pageDown");
        this.pushSection();
        return this;
    }
    get home() {
        this.keys.add("home");
        this.pushSection();
        return this;
    }
    get end() {
        this.keys.add("end");
        this.pushSection();
        return this;
    }
    get scrollLock() {
        this.keys.add("scrollLock");
        this.pushSection();
        return this;
    }
    get printScreen() {
        this.keys.add("printScreen");
        this.pushSection();
        return this;
    }
    get begin() {
        this.keys.add("begin");
        this.pushSection();
        return this;
    }
    get pause() {
        this.keys.add("pause");
        this.pushSection();
        return this;
    }
    get menu() {
        this.keys.add("menu");
        this.pushSection();
        return this;
    }
    get mediaPlay() {
        this.keys.add("mediaPlay");
        this.pushSection();
        return this;
    }
    get mediaPause() {
        this.keys.add("mediaPause");
        this.pushSection();
        return this;
    }
    get mediaPlayPause() {
        this.keys.add("mediaPlayPause");
        this.pushSection();
        return this;
    }
    get mediaReverse() {
        this.keys.add("mediaReverse");
        this.pushSection();
        return this;
    }
    get mediaStop() {
        this.keys.add("mediaStop");
        this.pushSection();
        return this;
    }
    get mediaFastForward() {
        this.keys.add("mediaFastForward");
        this.pushSection();
        return this;
    }
    get mediaRewind() {
        this.keys.add("mediaRewind");
        this.pushSection();
        return this;
    }
    get mediaTrackNext() {
        this.keys.add("mediaTrackNext");
        this.pushSection();
        return this;
    }
    get mediaTrackPrevious() {
        this.keys.add("mediaTrackPrevious");
        this.pushSection();
        return this;
    }
    get mediaRecord() {
        this.keys.add("mediaRecord");
        this.pushSection();
        return this;
    }
    get mediaLowerVolume() {
        this.keys.add("mediaLowerVolume");
        this.pushSection();
        return this;
    }
    get mediaRaiseVolume() {
        this.keys.add("mediaRaiseVolume");
        this.pushSection();
        return this;
    }
    get mediaMuteVolume() {
        this.keys.add("mediaMuteVolume");
        this.pushSection();
        return this;
    }
}

export class KeyMapBuilderStarter implements IKeyMapBuilder {
    constructor() {}

    public input(input: string) {
        return new KeyMapBuilder([]).input(input);
    }
    get leader() {
        return new KeyMapBuilder([]).leader;
    }
    get ctrl() {
        return new KeyMapBuilder([]).ctrl;
    }
    get alt() {
        return new KeyMapBuilder([]).alt;
    }
    get meta() {
        return new KeyMapBuilder([]).meta;
    }
    get super() {
        return new KeyMapBuilder([]).super;
    }
    get hyper() {
        return new KeyMapBuilder([]).hyper;
    }
    get f1() {
        return new KeyMapBuilder([]).f1;
    }
    get f2() {
        return new KeyMapBuilder([]).f2;
    }
    get f3() {
        return new KeyMapBuilder([]).f3;
    }
    get f4() {
        return new KeyMapBuilder([]).f4;
    }
    get f5() {
        return new KeyMapBuilder([]).f5;
    }
    get f6() {
        return new KeyMapBuilder([]).f6;
    }
    get f7() {
        return new KeyMapBuilder([]).f7;
    }
    get f8() {
        return new KeyMapBuilder([]).f8;
    }
    get f9() {
        return new KeyMapBuilder([]).f9;
    }
    get f10() {
        return new KeyMapBuilder([]).f10;
    }
    get f11() {
        return new KeyMapBuilder([]).f11;
    }
    get f12() {
        return new KeyMapBuilder([]).f12;
    }
    get f13() {
        return new KeyMapBuilder([]).f13;
    }
    get f14() {
        return new KeyMapBuilder([]).f14;
    }
    get f15() {
        return new KeyMapBuilder([]).f15;
    }
    get f16() {
        return new KeyMapBuilder([]).f16;
    }
    get f17() {
        return new KeyMapBuilder([]).f17;
    }
    get f18() {
        return new KeyMapBuilder([]).f18;
    }
    get f19() {
        return new KeyMapBuilder([]).f19;
    }
    get f20() {
        return new KeyMapBuilder([]).f20;
    }
    get f21() {
        return new KeyMapBuilder([]).f21;
    }
    get f22() {
        return new KeyMapBuilder([]).f22;
    }
    get f23() {
        return new KeyMapBuilder([]).f23;
    }
    get f24() {
        return new KeyMapBuilder([]).f24;
    }
    get f25() {
        return new KeyMapBuilder([]).f25;
    }
    get f26() {
        return new KeyMapBuilder([]).f26;
    }
    get f27() {
        return new KeyMapBuilder([]).f27;
    }
    get f28() {
        return new KeyMapBuilder([]).f28;
    }
    get f29() {
        return new KeyMapBuilder([]).f29;
    }
    get f30() {
        return new KeyMapBuilder([]).f30;
    }
    get f31() {
        return new KeyMapBuilder([]).f31;
    }
    get f32() {
        return new KeyMapBuilder([]).f32;
    }
    get f33() {
        return new KeyMapBuilder([]).f33;
    }
    get f34() {
        return new KeyMapBuilder([]).f34;
    }
    get f35() {
        return new KeyMapBuilder([]).f35;
    }
    get backspace() {
        return new KeyMapBuilder([]).backspace;
    }
    get delete() {
        return new KeyMapBuilder([]).delete;
    }
    get esc() {
        return new KeyMapBuilder([]).esc;
    }
    get insert() {
        return new KeyMapBuilder([]).insert;
    }
    get return() {
        return new KeyMapBuilder([]).return;
    }
    get tab() {
        return new KeyMapBuilder([]).tab;
    }
    get up() {
        return new KeyMapBuilder([]).up;
    }
    get down() {
        return new KeyMapBuilder([]).down;
    }
    get left() {
        return new KeyMapBuilder([]).left;
    }
    get right() {
        return new KeyMapBuilder([]).right;
    }
    get pageUp() {
        return new KeyMapBuilder([]).pageUp;
    }
    get pageDown() {
        return new KeyMapBuilder([]).pageDown;
    }
    get home() {
        return new KeyMapBuilder([]).home;
    }
    get end() {
        return new KeyMapBuilder([]).end;
    }
    get scrollLock() {
        return new KeyMapBuilder([]).scrollLock;
    }
    get printScreen() {
        return new KeyMapBuilder([]).printScreen;
    }
    get begin() {
        return new KeyMapBuilder([]).begin;
    }
    get pause() {
        return new KeyMapBuilder([]).pause;
    }
    get menu() {
        return new KeyMapBuilder([]).menu;
    }
    get mediaPlay() {
        return new KeyMapBuilder([]).mediaPlay;
    }
    get mediaPause() {
        return new KeyMapBuilder([]).mediaPause;
    }
    get mediaPlayPause() {
        return new KeyMapBuilder([]).mediaPlayPause;
    }
    get mediaReverse() {
        return new KeyMapBuilder([]).mediaReverse;
    }
    get mediaStop() {
        return new KeyMapBuilder([]).mediaStop;
    }
    get mediaFastForward() {
        return new KeyMapBuilder([]).mediaFastForward;
    }
    get mediaRewind() {
        return new KeyMapBuilder([]).mediaRewind;
    }
    get mediaTrackNext() {
        return new KeyMapBuilder([]).mediaTrackNext;
    }
    get mediaTrackPrevious() {
        return new KeyMapBuilder([]).mediaTrackPrevious;
    }
    get mediaRecord() {
        return new KeyMapBuilder([]).mediaRecord;
    }
    get mediaLowerVolume() {
        return new KeyMapBuilder([]).mediaLowerVolume;
    }
    get mediaRaiseVolume() {
        return new KeyMapBuilder([]).mediaRaiseVolume;
    }
    get mediaMuteVolume() {
        return new KeyMapBuilder([]).mediaMuteVolume;
    }
}

export class LeaderKeyMapBuilder extends BaseKeyMapBuilder {
    protected override sections: RawKeyMap[];
    protected override readSections: RawKeyMap[] | undefined;

    constructor(sections: RawKeyMap[]) {
        super();
        this.sections = sections;
    }

    public override $$read(): RawKeyMap[] {
        return this.$$readHelper();
    }
}

export class KeyMapBuilder extends BaseKeyMapBuilder {
    protected override sections: KeyMap[];
    protected override readSections: KeyMap[] | undefined;

    constructor(sections: KeyMap[]) {
        super();
        this.sections = sections;
    }

    public override $$read(): KeyMap[] {
        return this.$$readHelper() as KeyMap[];
    }
}

/**
 * Once the creator object is read, its computed value becomes immutable.  In other
 * words, once chaining is done the object essentially becomes readonly. Don't try
 * to assign the creator object to a variable and continue chaining from it later.
 *
 * @example
 * key.ctrl.alt.input("foo").ctrl.input("bar") becomes [{ key: ["ctrl", "alt"], input: "foo"}, {key: ["ctrl"], input: "bar"}]
 * */
export const key = new KeyMapBuilderStarter();
