import MutableNPC from "src/engine/mutable-objects/mutable-npc";
import { NPC } from "src/engine/objects";
import { Point } from "src/util";

describe("WebFun.Engine.MutableObjecs.MutableNPC", () => {
	let subject: MutableNPC;

	it("can be created as a copy of an existing NPC", () => {
		const template: NPC = {
			id: 5,
			enabled: true,
			face: null,
			position: new Point(0, 0, 1),
			direction: new Point(0, 0),
			bullet: new Point(0, 0),
			loot: -1,
			dropsLoot: false,
			waypoints: []
		} as any;

		subject = new MutableNPC(template);
		expect(subject.id).toBe(5);
		expect(subject.enabled).toBeTrue();
		expect(subject.loot).toBe(-1);
	});
});
