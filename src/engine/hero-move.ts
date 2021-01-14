import { Zone } from "./objects";
import Engine from "./engine";
import { Direction, Point } from "src/util";
import { EvaluationMode, ScriptResult } from "./script";
import { ZoneTransitionScene, ZoneScene } from "./scenes";
import { HotspotExecutionMode } from "./script/hotspot-execution-mode";
import { HotspotExecutionResult } from "./script/hotspot-execution-result";

function _tryTransition(direction: Point, engine: Engine, scene: ZoneScene): boolean | undefined {
	const hero = engine.hero;
	const currentZone = engine.currentZone;
	const targetLocation = Point.add(hero.location, direction);
	if (currentZone.bounds.contains(targetLocation)) {
		return false;
	}

	const zoneDirection = new Point(targetLocation.x, targetLocation.y);
	if (zoneDirection.x < 0) zoneDirection.x = -1;
	else if (zoneDirection.x >= 18) zoneDirection.x = 1;
	else zoneDirection.x = 0;

	if (zoneDirection.y < 0) zoneDirection.y = -1;
	else if (zoneDirection.y >= 18) zoneDirection.y = 1;
	else zoneDirection.y = 0;

	if (!zoneDirection.isUnidirectional()) {
		console.log("can't move two zones at once!");
		return false;
	}

	const { world, location: zoneLocation } = engine.findLocationOfZone(engine.currentZone);
	if (!zoneLocation) return;
	if (!world) return;

	const sector = world.at(zoneLocation);
	if (!sector || sector.zone !== engine.currentZone) {
		return;
	}

	const destinationZoneLocation = Point.add(zoneLocation, zoneDirection);
	const destinationSector = world.at(destinationZoneLocation);
	if (!destinationSector) return false;

	const destinationZone = destinationSector.zone;
	if (!destinationZone) return false;

	const targetLocationOnCurrentZone = Point.add(hero.location, direction);
	if (currentZone.bounds.contains(targetLocationOnCurrentZone)) return false;

	const destinationHeroLocation = Point.add(hero.location, direction);
	destinationHeroLocation.subtract(zoneDirection.x * 18, zoneDirection.y * 18);

	if (!destinationZone.placeWalkable(destinationHeroLocation)) {
		return false;
	}

	const transitionScene = new ZoneTransitionScene();
	transitionScene.destinationHeroLocation = destinationHeroLocation;
	transitionScene.destinationZoneLocation = destinationZoneLocation;
	transitionScene.originZoneLocation = zoneLocation;
	transitionScene.destinationZone = destinationZone;
	transitionScene.destinationWorld = world;
	transitionScene.scene = scene;
	engine.sceneManager.pushScene(transitionScene);

	return true;
}

export default async (
	direction: number,
	zone: Zone,
	engine: Engine,
	scene: ZoneScene
): Promise<ScriptResult> => {
	const hero = engine.hero;

	const dir = Direction.Confine(direction);
	const point = Direction.CalculateRelativeCoordinates(dir, 1);
	const p = new Point(point.x, point.y, 0);

	hero.isWalking = true;

	const targetPoint = Point.add(hero.location, p);
	const targetTile =
		zone.bounds.contains(targetPoint) &&
		zone.getTile(targetPoint.x, targetPoint.y, Zone.Layer.Object);

	if (targetTile) {
		// TODO: get rid of temporary state
		engine.temporaryState.bump = targetPoint;
		if (engine.hpu.execute(HotspotExecutionMode.Bump, targetPoint, null)) return;
		engine.spu.prepareExecution(EvaluationMode.Bump, zone);
		const scriptResult = await engine.spu.run();
		if (scriptResult !== ScriptResult.Done) {
			return scriptResult;
		}
	}

	if (!hero.move(p, zone)) {
		const doTransition = _tryTransition(p, engine, scene);
		if (doTransition === false) {
			// TODO: play blocked sound
		}
		return ScriptResult.Done;
	}

	const htspResult = engine.hpu.execute(HotspotExecutionMode.Walk);
	if (
		htspResult & HotspotExecutionResult.Speak ||
		htspResult & HotspotExecutionResult.ChangeZone ||
		htspResult & HotspotExecutionResult.Drop
	) {
		return ScriptResult.Wait;
	}

	return ScriptResult.Done;
};
