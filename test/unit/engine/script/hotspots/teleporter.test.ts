import { Hotspot } from "src/engine/objects";
import teleporter from "src/engine/script/hotspots/teleporter";
import { TeleportScene } from "src/engine/scenes";
import { HotspotExecutionResult } from "src/engine/script/hotspot-execution-result";

describe("WebFun.Engine.Script.Hotspots.Teleport", () => {
	let engine: any;

	beforeEach(() => mockEngine());

	it("does not if the hero holds no locator", () => {
		engine.inventory.contains.and.returnValue(false);
		expect(teleporter(engine, mockHotspot(Hotspot.Type.Teleporter))).toEqual(HotspotExecutionResult.Void);
		expect(engine.inventory.contains).toHaveBeenCalledWith(0x1a5);
	});

	it("simply pushes a new teleport scene if the hero holds a locator", () => {
		engine.inventory.contains.and.returnValue(true);
		expect(teleporter(engine, mockHotspot(Hotspot.Type.Teleporter))).toEqual(
			HotspotExecutionResult.ChangeZone
		);
		expect(engine.inventory.contains).toHaveBeenCalledWith(0x1a5);
		expect(engine.sceneManager.pushScene).toHaveBeenCalledWith(jasmine.any(TeleportScene));
	});

	function mockHotspot(type: Hotspot.Type, arg: number = -1): Hotspot {
		return { type, arg } as Hotspot;
	}

	function mockEngine() {
		engine = {
			inventory: { contains: jasmine.createSpy("inventory.contains") },
			sceneManager: { pushScene: jasmine.createSpy("sceneManager.pushScene") }
		} as any;
	}
});
