import { Engine } from "src/engine";
import { Hotspot, Zone, HotspotType } from "src/engine/objects";
import { TransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";

export default (engine: Engine, hotspot: Hotspot): boolean => {
	console.assert(hotspot.arg !== -1, "This is not where we're coming from!");

	const targetZone = engine.assetManager.get(Zone, hotspot.arg);
	const otherHotspot = targetZone.hotspots.find(({ type }) => type === HotspotType.xWingToDagobah);
	console.assert(otherHotspot !== null);
	const scene = new TransitionScene();
	scene.type = TransitionScene.Type.Room;
	scene.targetHeroLocation = new Point(otherHotspot.x, otherHotspot.y);
	scene.targetZone = targetZone;
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
	scene.scene = engine.sceneManager.currentScene as ZoneScene;

	const location = engine.world.locationOfZone(targetZone);
	console.assert(location !== null, "X-Wing destination must be on the main world!");
	scene.targetWorld = engine.world;
	scene.targetZoneLocation = location;
	engine.sceneManager.pushScene(scene);
	engine.temporaryState.enteredByPlane = true;
	return true;
};
