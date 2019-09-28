import { Hotspot, Zone } from "src/engine/objects";
import { Engine } from "src/engine";
import { Point } from "src/util";
import { RoomTransitionScene } from "src/engine/scenes";
import * as Scenes from "src/engine/scenes";
import xWingToDagobah from "src/engine/script/hotspots/x-wing-to-dagobah";

describe("WebFun.Engine.Script.Hotspots.xWingToDagobah", () => {
	let engine: Engine;
	let transitionScene: RoomTransitionScene;

	beforeEach(() => {
		transitionScene = {} as any;
		spyOn(console, "assert");
		spyOn(Scenes, "RoomTransitionScene").and.returnValue(transitionScene);
		mockEngine();
	});

	describe("when triggered", () => {
		let destinationZone: Zone;

		beforeEach(() => {
			destinationZone = {
				hotspots: [mockHotspot(Hotspot.Type.xWingFromDagobah, 5, new Point(2, 5))]
			} as any;
			engine.currentZone = { id: 5, hotspots: [mockHotspot(Hotspot.Type.xWingToDagobah, 235)] } as any;
			(engine.assets.get as any).and.returnValue(destinationZone);
			(engine.dagobah.findLocationOfZone as any).and.returnValue(new Point(3, 4));
			(engine.world.findLocationOfZone as any).and.returnValue(null);

			xWingToDagobah(engine, mockHotspot(Hotspot.Type.xWingToDagobah, 235));
		});

		it("pushes a new transition scene", () => {
			expect(engine.sceneManager.pushScene).toHaveBeenCalledWith(transitionScene);
		});

		it("sets the destination zone for the transition", () => {
			expect(transitionScene.destinationZone).toBe(destinationZone);
		});

		it("sets the destination world for the transition", () => {
			expect(transitionScene.destinationWorld).toBe(engine.dagobah);
		});

		it("sets the location of the zone on the destination world", () => {
			expect(transitionScene.destinationZoneLocation).toEqual(new Point(3, 4));
		});

		it("sets the hero's location on the destination zone", () => {
			expect(transitionScene.destinationHeroLocation).toEqual(new Point(2, 5));
		});

		it("sets a flag so EnterByPlane scripts are executed after the transition", () => {
			expect(engine.temporaryState.enteredByPlane).toBeTrue();
		});
	});

	function mockHotspot(type: Hotspot.Type, arg: number = -1, pos: Point = new Point(0, 0)): Hotspot {
		return { type, arg, x: pos.x, y: pos.y, enabled: true } as Hotspot;
	}

	function mockEngine() {
		engine = {
			assets: { get: jasmine.createSpy("assets.get") },
			inventory: { contains: jasmine.createSpy("inventory.contains") },
			sceneManager: { pushScene: jasmine.createSpy("sceneManager.pushScene"), currentScene: {} },
			dagobah: { findLocationOfZone: jasmine.createSpy("dagobah.findLocationOfZone") },
			world: { findLocationOfZone: jasmine.createSpy("world.findLocationOfZone") },
			temporaryState: { enteredByPlane: false }
		} as any;
	}
});
