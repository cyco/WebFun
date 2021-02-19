import { Hotspot, Zone } from "src/engine/objects";
import { Engine } from "src/engine";
import { Point } from "src/util";
import doorOut from "src/engine/script/hotspots/door-out";
import { RoomTransitionScene } from "src/engine/scenes";
import * as Scenes from "src/engine/scenes";

describe("WebFun.Engine.Script.Hotspots.DoorOut", () => {
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
			destinationZone = {} as any;
			engine.currentZone = { id: 5, doorInLocation: new Point(2, 5) } as any;
			(engine.assets.get as any).and.returnValue(destinationZone);
			(engine.findLocationOfZone as any).and.returnValue({
				location: new Point(3, 4),
				world: engine.world
			});

			doorOut(engine, mockHotspot(Hotspot.Type.DoorOut, 235));
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
			expect(transitionScene.destinationSector).toEqual(new Point(3, 4));
		});

		it("sets the hero's location on the target zone", () => {
			expect(transitionScene.destinationHeroLocation).toEqual(new Point(2, 5));
		});
	});

	describe("when triggered while on the dagobah", () => {
		let destinationZone: Zone;

		beforeEach(() => {
			destinationZone = {
				hotspots: [mockHotspot(Hotspot.Type.DoorIn, 5, new Point(2, 5))]
			} as any;
			engine.currentZone = { id: 5, hotspots: [mockHotspot(Hotspot.Type.DoorOut, 235)] } as any;
			(engine.assets.get as any).and.returnValue(destinationZone);
			(engine.findLocationOfZone as any).and.returnValue({
				location: new Point(3, 4),
				world: engine.dagobah
			});

			doorOut(engine, mockHotspot(Hotspot.Type.DoorOut, 235));
		});

		it("sets the target world for the transition to dagobah", () => {
			expect(transitionScene.destinationWorld).toBe(engine.dagobah);
		});
	});

	function mockHotspot(type: Hotspot.Type, arg: number = -1, pos: Point = new Point(0, 0)): Hotspot {
		return { type, arg, x: pos.x, y: pos.y, enabled: true, location: pos } as Hotspot;
	}

	function mockEngine() {
		engine = {
			assets: { get: jasmine.createSpy("assets.get") },
			inventory: { contains: jasmine.createSpy("inventory.contains") },
			sceneManager: { pushScene: jasmine.createSpy("sceneManager.pushScene"), currentScene: {} },
			dagobah: {},
			world: {},
			findLocationOfZone: jasmine.createSpy("engine.findLocationOfZone")
		} as any;
	}
});
