import NPC from "src/engine/objects/npc";

describe("WebFun.Engine.Objects.NPC", () => {
	let subject;
	beforeEach(() => (subject = new NPC()));

	it("is a class representing an npc", () => {
		expect(subject.enabled).toBeTrue();
	});

	it("initializes all properties", () => {
		expect(subject.id).toBe(-1);
		expect(subject.enabled).toBeTrue();
		expect(subject.face).toBeNull();
		expect(subject.loot).toBe(-1);
		expect(subject.unknown2).toBe(0);
		expect(subject.unknown3).toBeArray();
		expect(subject.position).toBeNull();
	});
});
