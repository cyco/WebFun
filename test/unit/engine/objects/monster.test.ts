import Monster from "src/engine/objects/monster";

describe("WebFun.Engine.Objects.Monster", () => {
	let subject: Monster;
	beforeEach(() => (subject = new Monster()));

	it("is a class representing an npc", () => {
		expect(subject.enabled).toBeTrue();
	});

	it("initializes all properties", () => {
		expect(subject.id).toBe(-1);
		expect(subject.enabled).toBeTrue();
		expect(subject.face).toBeNull();
		expect(subject.loot).toBe(-1);
		expect(subject.dropsLoot).toBeFalse();
		expect(subject.waypoints).toBeEmptyArray();
		expect(subject.position).toBeNull();
	});
});
