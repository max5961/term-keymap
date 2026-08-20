import type { Key, KeyMap } from "../types.js";

export interface IKeyHelper {
    input(input: string): KeyMapCreator;
    readonly ctrl: KeyMapCreator;
    readonly alt: KeyMapCreator;
    readonly meta: KeyMapCreator;
    readonly super: KeyMapCreator;
    readonly hyper: KeyMapCreator;
    readonly f1: KeyMapCreator;
    readonly f2: KeyMapCreator;
    readonly f3: KeyMapCreator;
    readonly f4: KeyMapCreator;
    readonly f5: KeyMapCreator;
    readonly f6: KeyMapCreator;
    readonly f7: KeyMapCreator;
    readonly f8: KeyMapCreator;
    readonly f9: KeyMapCreator;
    readonly f10: KeyMapCreator;
    readonly f11: KeyMapCreator;
    readonly f12: KeyMapCreator;
    readonly f13: KeyMapCreator;
    readonly f14: KeyMapCreator;
    readonly f15: KeyMapCreator;
    readonly f16: KeyMapCreator;
    readonly f17: KeyMapCreator;
    readonly f18: KeyMapCreator;
    readonly f19: KeyMapCreator;
    readonly f20: KeyMapCreator;
    readonly f21: KeyMapCreator;
    readonly f22: KeyMapCreator;
    readonly f23: KeyMapCreator;
    readonly f24: KeyMapCreator;
    readonly f25: KeyMapCreator;
    readonly f26: KeyMapCreator;
    readonly f27: KeyMapCreator;
    readonly f28: KeyMapCreator;
    readonly f29: KeyMapCreator;
    readonly f30: KeyMapCreator;
    readonly f31: KeyMapCreator;
    readonly f32: KeyMapCreator;
    readonly f33: KeyMapCreator;
    readonly f34: KeyMapCreator;
    readonly f35: KeyMapCreator;
    readonly backspace: KeyMapCreator;
    readonly delete: KeyMapCreator;
    readonly esc: KeyMapCreator;
    readonly insert: KeyMapCreator;
    readonly return: KeyMapCreator;
    readonly tab: KeyMapCreator;
    readonly up: KeyMapCreator;
    readonly down: KeyMapCreator;
    readonly left: KeyMapCreator;
    readonly right: KeyMapCreator;
    readonly pageUp: KeyMapCreator;
    readonly pageDown: KeyMapCreator;
    readonly home: KeyMapCreator;
    readonly end: KeyMapCreator;
    readonly scrollLock: KeyMapCreator;
    readonly printScreen: KeyMapCreator;
    readonly begin: KeyMapCreator;
    readonly pause: KeyMapCreator;
    readonly menu: KeyMapCreator;
    readonly mediaPlay: KeyMapCreator;
    readonly mediaPause: KeyMapCreator;
    readonly mediaPlayPause: KeyMapCreator;
    readonly mediaReverse: KeyMapCreator;
    readonly mediaStop: KeyMapCreator;
    readonly mediaFastForward: KeyMapCreator;
    readonly mediaRewind: KeyMapCreator;
    readonly mediaTrackNext: KeyMapCreator;
    readonly mediaTrackPrevious: KeyMapCreator;
    readonly mediaRecord: KeyMapCreator;
    readonly mediaLowerVolume: KeyMapCreator;
    readonly mediaRaiseVolume: KeyMapCreator;
    readonly mediaMuteVolume: KeyMapCreator;
}

export class KeyMapCreator implements IKeyHelper {
    private keys: Set<Key>;
    private mods: Set<Key>;
    private sections: KeyMap[];
    private readSections: KeyMap[] | undefined;

    constructor(
        keys: Set<Key> = new Set(),
        mods: Set<Key> = new Set(),
        sections: KeyMap[] = [],
    ) {
        this.keys = keys;
        this.mods = mods;
        this.sections = sections;
    }

    /** @internal
     * Once read/chaining is done, the instance essentially becomes immutable.
     * */
    public $$read(): KeyMap[] {
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

        this.sections.push(section);
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

export class KeyMapCreatorStarter implements IKeyHelper {
    constructor() {}

    public input(input: string) {
        return new KeyMapCreator().input(input);
    }
    get ctrl() {
        return new KeyMapCreator().ctrl;
    }
    get alt() {
        return new KeyMapCreator().alt;
    }
    get meta() {
        return new KeyMapCreator().meta;
    }
    get super() {
        return new KeyMapCreator().super;
    }
    get hyper() {
        return new KeyMapCreator().hyper;
    }
    get f1() {
        return new KeyMapCreator().f1;
    }
    get f2() {
        return new KeyMapCreator().f2;
    }
    get f3() {
        return new KeyMapCreator().f3;
    }
    get f4() {
        return new KeyMapCreator().f4;
    }
    get f5() {
        return new KeyMapCreator().f5;
    }
    get f6() {
        return new KeyMapCreator().f6;
    }
    get f7() {
        return new KeyMapCreator().f7;
    }
    get f8() {
        return new KeyMapCreator().f8;
    }
    get f9() {
        return new KeyMapCreator().f9;
    }
    get f10() {
        return new KeyMapCreator().f10;
    }
    get f11() {
        return new KeyMapCreator().f11;
    }
    get f12() {
        return new KeyMapCreator().f12;
    }
    get f13() {
        return new KeyMapCreator().f13;
    }
    get f14() {
        return new KeyMapCreator().f14;
    }
    get f15() {
        return new KeyMapCreator().f15;
    }
    get f16() {
        return new KeyMapCreator().f16;
    }
    get f17() {
        return new KeyMapCreator().f17;
    }
    get f18() {
        return new KeyMapCreator().f18;
    }
    get f19() {
        return new KeyMapCreator().f19;
    }
    get f20() {
        return new KeyMapCreator().f20;
    }
    get f21() {
        return new KeyMapCreator().f21;
    }
    get f22() {
        return new KeyMapCreator().f22;
    }
    get f23() {
        return new KeyMapCreator().f23;
    }
    get f24() {
        return new KeyMapCreator().f24;
    }
    get f25() {
        return new KeyMapCreator().f25;
    }
    get f26() {
        return new KeyMapCreator().f26;
    }
    get f27() {
        return new KeyMapCreator().f27;
    }
    get f28() {
        return new KeyMapCreator().f28;
    }
    get f29() {
        return new KeyMapCreator().f29;
    }
    get f30() {
        return new KeyMapCreator().f30;
    }
    get f31() {
        return new KeyMapCreator().f31;
    }
    get f32() {
        return new KeyMapCreator().f32;
    }
    get f33() {
        return new KeyMapCreator().f33;
    }
    get f34() {
        return new KeyMapCreator().f34;
    }
    get f35() {
        return new KeyMapCreator().f35;
    }
    get backspace() {
        return new KeyMapCreator().backspace;
    }
    get delete() {
        return new KeyMapCreator().delete;
    }
    get esc() {
        return new KeyMapCreator().esc;
    }
    get insert() {
        return new KeyMapCreator().insert;
    }
    get return() {
        return new KeyMapCreator().return;
    }
    get tab() {
        return new KeyMapCreator().tab;
    }
    get up() {
        return new KeyMapCreator().up;
    }
    get down() {
        return new KeyMapCreator().down;
    }
    get left() {
        return new KeyMapCreator().left;
    }
    get right() {
        return new KeyMapCreator().right;
    }
    get pageUp() {
        return new KeyMapCreator().pageUp;
    }
    get pageDown() {
        return new KeyMapCreator().pageDown;
    }
    get home() {
        return new KeyMapCreator().home;
    }
    get end() {
        return new KeyMapCreator().end;
    }
    get scrollLock() {
        return new KeyMapCreator().scrollLock;
    }
    get printScreen() {
        return new KeyMapCreator().printScreen;
    }
    get begin() {
        return new KeyMapCreator().begin;
    }
    get pause() {
        return new KeyMapCreator().pause;
    }
    get menu() {
        return new KeyMapCreator().menu;
    }
    get mediaPlay() {
        return new KeyMapCreator().mediaPlay;
    }
    get mediaPause() {
        return new KeyMapCreator().mediaPause;
    }
    get mediaPlayPause() {
        return new KeyMapCreator().mediaPlayPause;
    }
    get mediaReverse() {
        return new KeyMapCreator().mediaReverse;
    }
    get mediaStop() {
        return new KeyMapCreator().mediaStop;
    }
    get mediaFastForward() {
        return new KeyMapCreator().mediaFastForward;
    }
    get mediaRewind() {
        return new KeyMapCreator().mediaRewind;
    }
    get mediaTrackNext() {
        return new KeyMapCreator().mediaTrackNext;
    }
    get mediaTrackPrevious() {
        return new KeyMapCreator().mediaTrackPrevious;
    }
    get mediaRecord() {
        return new KeyMapCreator().mediaRecord;
    }
    get mediaLowerVolume() {
        return new KeyMapCreator().mediaLowerVolume;
    }
    get mediaRaiseVolume() {
        return new KeyMapCreator().mediaRaiseVolume;
    }
    get mediaMuteVolume() {
        return new KeyMapCreator().mediaMuteVolume;
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
export const key = new KeyMapCreatorStarter();
