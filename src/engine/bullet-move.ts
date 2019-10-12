import { ScriptResult, EvaluationMode } from "./script";
import Engine from "./engine";
import { Direction } from "src/util";
import { Monster, Char, Hotspot, Zone, Tile } from "./objects";
import { MutableHotspot } from "./mutable-objects";
import AssetManager from "./asset-manager";

function hitMonster(monster: Monster, weapon: Char, zone: Zone, assets: AssetManager) {
	monster.damageTaken += weapon.damage;
	if (!monster.alive) {
		zone.setTile(null, monster.position);
		monster.enabled = false;

		if (monster.dropsLoot) _dropLoot(monster, zone, assets);
	}
}

function _dropLoot(monster: Monster, zone: Zone, assets: AssetManager) {
	const hotspot = new MutableHotspot();
	hotspot.type = Hotspot.Type.DropItem;
	hotspot.enabled = true;
	hotspot.location = monster.position;

	let itemId = -1;
	if (monster.loot > 0) itemId = monster.loot - 1;
	else {
		const hotspots = zone.hotspots.withType(Hotspot.Type.DropQuestItem).filter(htsp => htsp.arg > 0);

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
		case Direction.SouthEast:
		case Direction.SouthWest:
			return Char.FrameEntry.Down;
		case Direction.North:
		case Direction.NorthEast:
		case Direction.NorthWest:
			return Char.FrameEntry.Up;
		case Direction.East:
			return Char.FrameEntry.Right;
		case Direction.West:
			return Char.FrameEntry.Left;
	}
}

export default async (engine: Engine, zone: Zone): Promise<ScriptResult> => {
	const hero = engine.hero;
	const assets = engine.assets;

	if (!hero.isAttacking) return ScriptResult.Done;
	const frames = hero._actionFrames;

	if (frames === 3) {
		hero.isAttacking = false;
		hero._actionFrames = 0;
		return ScriptResult.Done;
	}

	const direction = Direction.Confine(hero.direction, true);
	const target = hero.location.byAdding(Direction.CalculateRelativeCoordinates(direction, frames + 1));

	const hitMonsters = zone.monsters.filter(
		({ position, alive, enabled }) => alive && enabled && position.isEqualTo(target)
	);

	hitMonsters.forEach(monster => hitMonster(monster, hero.weapon, zone, assets));
	if (hitMonsters.length) {
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
		engine.spu.prepeareExecution(EvaluationMode.PlaceItem, zone);
		return await engine.spu.run();
	}

	hero.isAttacking = false;
	hero._actionFrames = 0;
	// TODO: damage npc
};
