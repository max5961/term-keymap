import { describe, expect, test } from "vitest";
import { key, type BaseKeyMapBuilder } from "../src/util/KeyMapBuilder.ts";
import { ExpandedKeyMap, KeyMap } from "../src/types.ts";

const parse = (k: BaseKeyMapBuilder, leader?: ExpandedKeyMap) => {
    return k.$$read(leader);
};

describe("KeyMapBuilder", () => {
    test(".input('a')", () => {
        const k = parse(key.input("a"));
        expect(k).toEqual([{ input: "a" }]);
    });

    test("input always creates keymap token in expanded form", () => {
        const k = parse(key.input("foo"));
        expect(k).toEqual([{ input: "f" }, { input: "o" }, { input: "o" }]);
    });

    test("input creates keymap in expanded form with modifier keys", () => {
        const k = parse(key.ctrl.alt.input("foo"));
        expect(k).toEqual([
            { key: ["ctrl", "alt"], input: "f" },
            { key: ["ctrl", "alt"], input: "o" },
            { key: ["ctrl", "alt"], input: "o" },
        ]);
    });

    test("combining sections", () => {
        const k = parse(key.ctrl.input("foo").alt.input("bar"));
        expect(k).toEqual([
            { key: ["ctrl"], input: "f" },
            { key: ["ctrl"], input: "o" },
            { key: ["ctrl"], input: "o" },
            { key: ["alt"], input: "b" },
            { key: ["alt"], input: "a" },
            { key: ["alt"], input: "r" },
        ]);
    });

    test("modifiers + non-alphanumeric", () => {
        const k = parse(key.ctrl.alt.f1);
        expect(k).toEqual([{ key: ["ctrl", "alt", "f1"] }]);
    });

    test("non modifier keys always creates new section", () => {
        const k = parse(key.f1.f2.f3.input("foo"));
        expect(k).toEqual([
            { key: ["f1"] },
            { key: ["f2"] },
            { key: ["f3"] },
            { input: "f" },
            { input: "o" },
            { input: "o" },
        ]);
    });

    describe("works with leader combinations", () => {
        const leader: ExpandedKeyMap = [{ key: ["ctrl"], input: "a" }];

        test("leader + single input char", () => {
            const k = parse(key.leader.input("f"), leader);
            expect(k).toEqual([...leader, { input: "f" }]);
        });

        test("leader + multiple input chars only prepends leader once", () => {
            const k = parse(key.leader.input("foo"), leader);
            expect(k).toEqual([
                ...leader,
                { input: "f" },
                { input: "o" },
                { input: "o" },
            ]);
        });

        test("leader after input", () => {
            const k = parse(key.input("foo").leader, leader);
            expect(k).toEqual([
                { input: "f" },
                { input: "o" },
                { input: "o" },
                ...leader,
            ]);
        });

        test("multiple consecutive leaders", () => {
            const k = parse(key.leader.leader.leader.input("a"), leader);
            // prettier-ignore
            expect(k).toEqual([
                ...leader,
                ...leader,
                ...leader,
                { input: "a" }
            ])
        });

        test("multiple non-consecutive leaders", () => {
            const k = parse(key.leader.input("a").leader.input("b"), leader);
            expect(k).toEqual([
                ...leader,
                { input: "a" },
                ...leader,
                { input: "b" },
            ]);
        });

        test("leader with modifiers", () => {
            const k = parse(key.leader.ctrl.alt.input("a"), leader);
            expect(k).toEqual([
                ...leader,
                { key: ["ctrl", "alt"], input: "a" },
            ]);
        });

        test("leader after keys", () => {
            const k = parse(key.f1.leader, leader);
            expect(k).toEqual([{ key: ["f1"] }, ...leader]);
        });

        // Illegal because mods aren't matched with any input but still produces illegal token.
        // The correct usage/intent here would be `key.leader.ctrl.alt.input("a")`
        test("leader after mods still produces illegal keymap token", () => {
            const k = parse(key.ctrl.alt.leader.input("a"), leader);
            expect(k).toEqual([
                { key: ["ctrl", "alt"] },
                ...leader,
                { input: "a" },
            ]);
        });
    });

    describe("Check all keys for typos and ensure all non-modifiers create new sections", () => {
        // prettier-ignore
        test.each<[string, BaseKeyMapBuilder, KeyMap[]]>([
            ["ctrl",               key.ctrl.input("a"),               [{ key: ["ctrl"], input: "a" }]],
            ["alt",                key.alt.input("a"),                [{ key: ["alt"], input: "a"}]],
            ["meta",               key.meta.input("a"),               [{ key: ["meta"], input: "a" }]],
            ["super",              key.super.input("a"),              [{ key: ["super"], input: "a" }]],
            ["f1",                 key.f1.input("a"),                 [{ key: ["f1"]}, { input: "a" }]],
            ["f2",                 key.f2.input("a"),                 [{ key: ["f2"]}, { input: "a" }]],
            ["f3",                 key.f3.input("a"),                 [{ key: ["f3"]}, { input: "a" }]],
            ["f4",                 key.f4.input("a"),                 [{ key: ["f4"]}, { input: "a" }]],
            ["f5",                 key.f5.input("a"),                 [{ key: ["f5"]}, { input: "a" }]],
            ["f6",                 key.f6.input("a"),                 [{ key: ["f6"]}, { input: "a" }]],
            ["f7",                 key.f7.input("a"),                 [{ key: ["f7"]}, { input: "a" }]],
            ["f8",                 key.f8.input("a"),                 [{ key: ["f8"]}, { input: "a" }]],
            ["f9",                 key.f9.input("a"),                 [{ key: ["f9"]}, { input: "a" }]],
            ["f10",                key.f10.input("a"),                [{ key: ["f10"]}, { input: "a" }]],
            ["f11",                key.f11.input("a"),                [{ key: ["f11"]}, { input: "a" }]],
            ["f12",                key.f12.input("a"),                [{ key: ["f12"]}, { input: "a" }]],
            ["f13",                key.f13.input("a"),                [{ key: ["f13"]}, { input: "a" }]],
            ["f14",                key.f14.input("a"),                [{ key: ["f14"]}, { input: "a" }]],
            ["f15",                key.f15.input("a"),                [{ key: ["f15"]}, { input: "a" }]],
            ["f16",                key.f16.input("a"),                [{ key: ["f16"]}, { input: "a" }]],
            ["f17",                key.f17.input("a"),                [{ key: ["f17"]}, { input: "a" }]],
            ["f18",                key.f18.input("a"),                [{ key: ["f18"]}, { input: "a" }]],
            ["f19",                key.f19.input("a"),                [{ key: ["f19"]}, { input: "a" }]],
            ["f20",                key.f20.input("a"),                [{ key: ["f20"]}, { input: "a" }]],
            ["f21",                key.f21.input("a"),                [{ key: ["f21"]}, { input: "a" }]],
            ["f22",                key.f22.input("a"),                [{ key: ["f22"]}, { input: "a" }]],
            ["f23",                key.f23.input("a"),                [{ key: ["f23"]}, { input: "a" }]],
            ["f24",                key.f24.input("a"),                [{ key: ["f24"]}, { input: "a" }]],
            ["f25",                key.f25.input("a"),                [{ key: ["f25"]}, { input: "a" }]],
            ["f26",                key.f26.input("a"),                [{ key: ["f26"]}, { input: "a" }]],
            ["f27",                key.f27.input("a"),                [{ key: ["f27"]}, { input: "a" }]],
            ["f28",                key.f28.input("a"),                [{ key: ["f28"]}, { input: "a" }]],
            ["f29",                key.f29.input("a"),                [{ key: ["f29"]}, { input: "a" }]],
            ["f30",                key.f30.input("a"),                [{ key: ["f30"]}, { input: "a" }]],
            ["f31",                key.f31.input("a"),                [{ key: ["f31"]}, { input: "a" }]],
            ["f32",                key.f32.input("a"),                [{ key: ["f32"]}, { input: "a" }]],
            ["f33",                key.f33.input("a"),                [{ key: ["f33"]}, { input: "a" }]],
            ["f34",                key.f34.input("a"),                [{ key: ["f34"]}, { input: "a" }]],
            ["f35",                key.f35.input("a"),                [{ key: ["f35"]}, { input: "a" }]],
            ["backspace",          key.backspace.input("a"),          [{ key: ["backspace"]}, { input: "a" }]],
            ["delete",             key.delete.input("a"),             [{ key: ["delete"]}, { input: "a" }]],
            ["esc",                key.esc.input("a"),                [{ key: ["esc"] }, { input: "a" }]],
            ["insert",             key.insert.input("a"),             [{ key: ["insert"] }, { input: "a" }]],
            ["return",             key.return.input("a"),             [{ key: ["return"] }, { input: "a" }]],
            ["tab",                key.tab.input("a"),                [{ key: ["tab"] }, { input: "a" }]],
            ["up",                 key.up.input("a"),                 [{ key: ["up"] }, { input: "a" }]],
            ["down",               key.down.input("a"),               [{ key: ["down"] }, { input: "a" }]],
            ["left",               key.left.input("a"),               [{ key: ["left"] }, { input: "a" }]],
            ["right",              key.right.input("a"),              [{ key: ["right"] }, { input: "a" }]],
            ["pageUp",             key.pageUp.input("a"),             [{ key: ["pageUp"] }, { input: "a" }]],
            ["pageDown",           key.pageDown.input("a"),           [{ key: ["pageDown"] }, { input: "a" }]],
            ["home",               key.home.input("a"),               [{ key: ["home"] }, { input: "a" }]],
            ["end",                key.end.input("a"),                [{ key: ["end"] }, { input: "a"} ]],
            ["scrollLock",         key.scrollLock.input("a"),         [{ key: ["scrollLock"] }, { input: "a" }]],
            ["printScreen",        key.printScreen.input("a"),        [{ key: ["printScreen"] }, { input: "a" }]],
            ["begin",              key.begin.input("a"),              [{ key: ["begin"] }, { input: "a" }]],
            ["pause",              key.pause.input("a"),              [{ key: ["pause"] }, { input: "a" }]],
            ["menu",               key.menu.input("a"),               [{ key: ["menu"] }, { input: "a" }]],
            ["mediaPlay",          key.mediaPlay.input("a"),          [{ key: ["mediaPlay"] }, { input: "a" }]],
            ["mediaPause",         key.mediaPause.input("a"),         [{ key: ["mediaPause"] }, { input: "a" }]],
            ["mediaPlayPause",     key.mediaPlayPause.input("a"),     [{ key: ["mediaPlayPause"] }, { input: "a" }]],
            ["mediaReverse",       key.mediaReverse.input("a"),       [{ key: ["mediaReverse"] }, { input: "a" }]],
            ["mediaStop",          key.mediaStop.input("a"),          [{ key: ["mediaStop"] }, { input: "a" }]],
            ["mediaFastForward",   key.mediaFastForward.input("a"),   [{ key: ["mediaFastForward"] }, { input: "a" }]],
            ["mediaRewind",        key.mediaRewind.input("a"),        [{ key: ["mediaRewind"] }, { input: "a" }]],
            ["mediaTrackNext",     key.mediaTrackNext.input("a"),     [{ key: ["mediaTrackNext"] }, { input: "a" }]],
            ["mediaTrackPrevious", key.mediaTrackPrevious.input("a"), [{ key: ["mediaTrackPrevious"] }, { input: "a" }]],
            ["mediaRecord",        key.mediaRecord.input("a"),        [{ key: ["mediaRecord"] }, { input: "a" }]],
            ["mediaLowerVolume",   key.mediaLowerVolume.input("a"),   [{ key: ["mediaLowerVolume"] }, { input: "a" }]],
            ["mediaRaiseVolume",   key.mediaRaiseVolume.input("a"),   [{ key: ["mediaRaiseVolume"] }, { input: "a" }]],
            ["mediaMuteVolume",    key.mediaMuteVolume.input("a"),    [{ key: ["mediaMuteVolume"] }, { input: "a" }]],
        ])("key.%s + input 'a'", (_name, creator, expected) => {
            expect(creator.$$read()).toEqual(expected)
        });
    });
});
