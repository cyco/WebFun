import { Hotspot, Zone } from "src/engine/objects";
import { Engine } from "src/engine";
import doorIn from "src/engine/script/hotspots/door-in";
import { RoomTransitionScene } from "src/engine/scenes";
import * as Scenes from "src/engine/scenes";
import { Point } from "src/util";

describe("WebFun.Engine.Script.Hotspots.DoorIn", () => {
	let engine: Engine;
	let transitionScene: RoomTransitionScene;

	beforeEach(() => {
		transitionScene = {} as any;
		spyOn(console, "assert");
		spyOn(Scenes, "RoomTransitionScene").and.returnValue(transitionScene);
		mockEngine();
	});

	describe("when triggered with the id of a zone on the main world", () => {
		let destinationZone: Zone;

		beforeEach(() => {
			destinationZone = {
				hotspots: [mockHotspot(Hotspot.Type.DoorOut, -1, new Point(2, 5))]
			} as any;
			engine.currentZone = { id: 5 } as any;
			(engine.assetManager.get as any).and.returnValue(destinationZone);
			(engine.dagobah.findLocationOfZone as any).and.returnValue(null);
			(engine.world.findLocationOfZone as any).and.returnValue(new Point(3, 4));
			doorIn(engine, mockHotspot(Hotspot.Type.DoorIn, 235));
		});

		it("pushes a new transition scene", () => {
			expect(engine.sceneManager.pushScene).toHaveBeenCalledWith(transitionScene);
		});

		it("sets the target zone for the transition", () => {
			expect(transitionScene.destinationZone).toBe(destinationZone);
		});

		it("sets the target world for the transition", () => {
			expect(transitionScene.destinationWorld).toBe(engine.world);
		});

		it("sets the location of the zone on the target world", () => {
			expect(transitionScene.destinationZoneLocation).toEqual(new Point(3, 4));
		});

		it("sets the hero's location on the target zone", () => {
			expect(transitionScene.destinationHeroLocation).toEqual(new Point(2, 5));
		});
	});

	describe("when triggered with the id of a zone on the dagobah", () => {
		let destinationZone: Zone;

		beforeEach(() => {
			destinationZone = {
				hotspots: [mockHotspot(Hotspot.Type.DoorOut, -1, new Point(2, 5))]
			} as any;
			engine.currentZone = { id: 5 } as any;
			(engine.assetManager.get as any).and.returnValue(destinationZone);
			(engine.dagobah.findLocationOfZone as any).and.returnValue(new Point(4, 5));
			(engine.world.findLocationOfZone as any).and.returnValue(null);
			doorIn(engine, mockHotspot(Hotspot.Type.DoorIn, 235));
		});

		it("sets the target world for the transition to dagobah", () => {
			expect(transitionScene.destinationWorld).toBe(engine.dagobah);
		});
	});

	function mockHotspot(type: Hotspot.Type, arg: number = -1, pos: Point = new Point(0, 0)): Hotspot {
		return { type, arg, x: pos.x, y: pos.y } as Hotspot;
	}

	function mockEngine() {
		engine = {
			assetManager: { get: jasmine.createSpy("assetManager.get") },
			inventory: { contains: jasmine.createSpy("inventory.contains") },
			sceneManager: { pushScene: jasmine.createSpy("sceneManager.pushScene"), currentScene: {} },
			dagobah: { findLocationOfZone: jasmine.createSpy("dagobah.findLocationOfZone") },
			world: { findLocationOfZone: jasmine.createSpy("world.findLocationOfZone") }
		} as any;
	}
});
