import { Hotspot, Zone } from "src/engine/objects";
import { Engine } from "src/engine";
import { Point } from "src/util";
import * as Scenes from "src/engine/scenes";
import { RoomTransitionScene } from "src/engine/scenes";
import ShipToPlanet from "src/engine/script/hotspots/ship-to-planet";

describe("WebFun.Engine.Script.Hotspots.ShipToPlanet", () => {
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
				hotspots: [mockHotspot(Hotspot.Type.ShipFromPlanet, 5, new Point(2, 5))]
			} as any;
			engine.currentZone = {
				id: 5,
				hotspots: [mockHotspot(Hotspot.Type.ShipToPlanet, 235)]
			} as any;
			(engine.assets.get as any).and.returnValue(destinationZone);
			(engine.dagobah.findLocationOfZone as any).and.returnValue(null);
			(engine.world.findLocationOfZone as any).and.returnValue(new Point(3, 4));

			ShipToPlanet(engine, mockHotspot(Hotspot.Type.ShipToPlanet, 235));
		});

		it("pushes a new transition scene", () => {
			expect(engine.sceneManager.pushScene).toHaveBeenCalledWith(transitionScene);
		});

		it("sets the destination zone for the transition", () => {
			expect(transitionScene.destinationZone).toBe(destinationZone);
		});

		it("sets the destination world for the transition", () => {
			expect(transitionScene.destinationWorld).toBe(engine.world);
		});

		it("sets the location of the zone on the destination world", () => {
			expect(transitionScene.destinationSector).toEqual(new Point(3, 4));
		});

		it("sets the hero's location on the destination zone", () => {
			expect(transitionScene.destinationHeroLocation).toEqual(new Point(2, 5));
		});
	});

	function mockHotspot(
		type: Hotspot.Type,
		argument: number = -1,
		pos: Point = new Point(0, 0)
	): Hotspot {
		return { type, argument, x: pos.x, y: pos.y, enabled: true } as Hotspot;
	}

	function mockEngine() {
		engine = {
			assets: { get: jasmine.createSpy("assets.get") },
			inventory: { contains: jasmine.createSpy("inventory.contains") },
			sceneManager: { pushScene: jasmine.createSpy("sceneManager.pushScene"), currentScene: {} },
			dagobah: { findLocationOfZone: jasmine.createSpy("dagobah.findLocationOfZone") },
			world: { findLocationOfZone: jasmine.createSpy("world.findLocationOfZone") }
		} as any;
	}
});
