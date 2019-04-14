import MapScene from "./map-scene";
import TransitionScene from "./transition-scene";
import ZoneScene from "./zone-scene";
import { Zone, HotspotType } from "src/engine/objects";
import { Point } from "src/util";

class TeleportScene extends MapScene {
	protected isZoneConsideredSolved(zone: Zone): boolean {
		if (!zone.hasTeleporter) return super.isZoneConsideredSolved(zone);

		return zone.hotspots.withType(HotspotType.Teleporter).some(htsp => htsp.enabled);
	}

	protected handleMouseDown(_: Point, zone: Zone) {
		const engine = this.engine;
		this.exitScene();

		const transitionScene = new TransitionScene();
		transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
		transitionScene.targetHeroLocation = engine.hero.location;
		transitionScene.targetZone = zone;
		transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;

		let world = engine.dagobah;
		let location = world.locationOfZone(transitionScene.targetZone);
		if (!location) {
			world = engine.world;
			location = world.locationOfZone(transitionScene.targetZone);
		}
		transitionScene.targetWorld = world;
		transitionScene.targetZoneLocation = zone.hotspots
			.withType(HotspotType.Teleporter)
			.find(htsp => htsp.enabled).location;
		engine.sceneManager.pushScene(transitionScene);
	}
}

export default TeleportScene;
