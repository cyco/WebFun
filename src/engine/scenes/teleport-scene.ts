import MapScene from "./map-scene";
import TransitionScene from "./transition-scene";
import ZoneScene from "./zone-scene";
import { HotspotType, Zone } from "src/engine/objects";
import { Point } from "src/util";

class TeleportScene extends MapScene {
	protected isZoneConsideredSolved(zone: Zone): boolean {
		if (!zone.hasTeleporter) return super.isZoneConsideredSolved(zone);

		return zone.hotspots.withType(HotspotType.Teleporter).some(htsp => htsp.enabled);
	}

	protected handleMouseDown(_: Point, zone: Zone) {
		const engine = this.engine;
		this.exitScene();

		const target = zone.hotspots.withType(HotspotType.Teleporter).find(htsp => htsp.enabled);
		if (!target) return;

		const scene = new TransitionScene();
		scene.type = TransitionScene.TRANSITION_TYPE.ROOM;
		scene.targetHeroLocation = target.location;
		scene.targetZone = zone;
		scene.scene = engine.sceneManager.currentScene as ZoneScene;

		let world = engine.dagobah;
		let location = world.locationOfZone(scene.targetZone);
		if (!location) {
			world = engine.world;
			location = world.locationOfZone(scene.targetZone);
		}

		scene.targetWorld = world;
		scene.targetZoneLocation = engine.currentWorld.locationOfZone(zone);
		engine.sceneManager.pushScene(scene);
	}
}

export default TeleportScene;
