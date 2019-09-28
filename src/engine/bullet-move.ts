import { ScriptResult, EvaluationMode } from "./script";
import Engine from "./engine";
import { Direction } from "src/util";
import { NPC, Char, Hotspot, Zone, Tile } from "./objects";
import { MutableHotspot } from "./mutable-objects";
import AssetManager from "./asset-manager";

function hitNPC(npc: NPC, weapon: Char, zone: Zone, assets: AssetManager) {
	npc.damageTaken += weapon.damage;
	if (!npc.alive) {
		zone.setTile(null, npc.position);
		npc.enabled = false;

		if (npc.dropsLoot) _dropLoot(npc, zone, assets);
	}
}

function _dropLoot(npc: NPC, zone: Zone, assets: AssetManager) {
	const hotspot = new MutableHotspot();
	hotspot.type = Hotspot.Type.CrateItem;
	hotspot.enabled = true;
	hotspot.location = npc.position;

	let itemId = -1;
	if (npc.loot > 0) itemId = npc.loot - 1;
	else {
		const hotspots = zone.hotspots.withType(Hotspot.Type.TriggerLocation).filter(htsp => htsp.arg > 0);

		if (!hotspots.length) return;

		const hotspot = hotspots.first();
		itemId = hotspot.arg;
		hotspot.enabled = false;
	}

	if (itemId === -1) return;

	hotspot.arg = itemId;

	zone.hotspots.push(hotspot);

	const tile = assets.get(Tile, hotspot.arg);
	zone.setTile(tile, hotspot.location.x, hotspot.location.y, Zone.Layer.Object);
}

function bulletTileForBullet(engine: Engine): Tile {
	const hero = engine.hero;
	if (hero._actionFrames === 3) {
		return null;
	}

	const frames = hero.weapon.frames;
	const direction = hero.direction;
	const frameEntry = frameLocationForDirection(direction);
	return frames[0].tiles[frameEntry];
}

function frameLocationForDirection(direction: number) {
	switch (Direction.Confine(direction)) {
		case Direction.South:
			return Char.FrameEntry.Down;
		case Direction.North:
			return Char.FrameEntry.Up;
		case Direction.East:
			return Char.FrameEntry.Right;
		case Direction.West:
			return Char.FrameEntry.Left;
	}
}

export default async (engine: Engine, zone: Zone): Promise<ScriptResult> => {
	const hero = engine.hero;
	const assets = engine.assetManager;

	if (!hero.isAttacking) return ScriptResult.Done;
	const frames = hero._actionFrames;

	if (frames === 3) {
		hero.isAttacking = false;
		hero._actionFrames = 0;
		return ScriptResult.Done;
	}

	const target = hero.location.byAdding(Direction.CalculateRelativeCoordinates(hero.direction, frames + 1));

	const hitNPCs = zone.npcs.filter(
		({ position, alive, enabled }) => alive && enabled && position.isEqualTo(target)
	);

	hitNPCs.forEach(npc => hitNPC(npc, hero.weapon, zone, assets));
	if (hitNPCs.length) {
		hero.isAttacking = false;
		hero._actionFrames = 0;
		return ScriptResult.Done;
	}

	const tile = zone.getTile(target);
	if (!bulletTileForBullet(engine)) return ScriptResult.Done;

	if (!tile || tile.isOpaque()) {
		// evaluate scripts
		engine.inputManager.placedTileLocation = target;
		engine.inputManager.placedTile = hero.weapon.frames[0].tiles[Char.FrameEntry.ExtensionRight];
		engine.scriptExecutor.prepeareExecution(EvaluationMode.PlaceItem, zone);
		return await engine.scriptExecutor.execute();
	}

	hero.isAttacking = false;
	hero._actionFrames = 0;
	// TODO: damage npc
};
