import AssetManager from "src/engine/asset-manager";
import { Character } from "src/engine/objects";
import Monster from "src/engine/objects/monster";
import { Point } from "src/util";

describe("WebFun.Engine.Objects.Monster", () => {
	let assets: AssetManager;
	let subject: Monster;
	beforeEach(() => {
		assets = new AssetManager();
		assets.populate(Character, []);

		subject = new Monster(
			0,
			{ character: 0, x: 0, y: 0, loot: -1, dropsLoot: false, waypoints: new Int32Array() },
			assets
		);
	});

	it("is a class representing an npc", () => {
		expect(subject.enabled).toBeTrue();
	});

	it("initializes all properties", () => {
		expect(subject.id).toBe(0);
		expect(subject.enabled).toBeTrue();
		expect(subject.face).toBeNull();
		expect(subject.loot).toBe(-1);
		expect(subject.dropsLoot).toBeFalse();
		expect(subject.waypoints).toBeEmptyArray();
		expect(subject.position).toEqual(new Point(0, 0, 1));
	});
});
