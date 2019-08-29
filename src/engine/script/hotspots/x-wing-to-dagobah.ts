import { Engine } from "src/engine";
import { Hotspot, Zone, HotspotType } from "src/engine/objects";
import { TransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";

export default (engine: Engine, hotspot: Hotspot): boolean => {
	console.assert(hotspot.arg !== -1, "This is not where we're coming from!");

	const targetZone = engine.assetManager.get(Zone, hotspot.arg);
	const desinationHotspot = targetZone.hotspots.withType(HotspotType.xWingFromDagobah).first();
	const location = engine.dagobah.locationOfZone(targetZone);
	console.assert(desinationHotspot !== null, "Zone does not have a proper target spot");
	console.assert(location !== null, "X-Wing destination must be on dagobah!");
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);

	const scene = new TransitionScene();
	scene.type = TransitionScene.Type.Room;
	scene.targetHeroLocation = new Point(desinationHotspot.x, desinationHotspot.y);
	scene.targetZone = targetZone;
	scene.scene = engine.sceneManager.currentScene as ZoneScene;
	scene.targetWorld = engine.dagobah;
	scene.targetZoneLocation = location;
	engine.sceneManager.pushScene(scene);
	engine.temporaryState.enteredByPlane = true;
	return true;
};
