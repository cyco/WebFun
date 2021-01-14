import MutableMonster from "src/engine/mutable-objects/mutable-monster";
import { Monster } from "src/engine/objects";
import { Point } from "src/util";

describe("WebFun.Engine.MutableObjects.MutableMonster", () => {
	let subject: MutableMonster;

	it("can be created as a copy of an existing NPC", () => {
		const template: Monster = {
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

		subject = new MutableMonster(template);
		expect(subject.id).toBe(5);
		expect(subject.enabled).toBeTrue();
		expect(subject.loot).toBe(-1);
	});
});
