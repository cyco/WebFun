import { ScriptResult, EvaluationMode } from "./script";
import Engine from "./engine";
import { Direction } from "src/util";
import { Monster, Character, Hotspot, Zone, Tile } from "./objects";
import AssetManager from "./asset-manager";
import { Yoda } from "src/variant";

function hitMonster(monster: Monster, weapon: Character, zone: Zone, assets: AssetManager) {
	if (weapon.id === Yoda.charIDs.TheForce) {
		monster.cooldown = weapon.damage;
		return;
	}

	if (monster.face?.health < 0) return;

	monster.damageTaken += weapon.damage;
	if (!monster.alive) {
		zone.setTile(null, monster.position);
		monster.enabled = false;

		if (monster.dropsLoot) _dropLoot(monster, zone, assets);
	}
}

function _dropLoot(monster: Monster, zone: Zone, assets: AssetManager) {
	const hotspot = new Hotspot(0, {
		type: Hotspot.Type.DropItem.rawValue,
		enabled: true,
		x: monster.position.x,
		y: monster.position.y,
		argument: -1
	});

	let itemId = -1;
	if (monster.loot > 0) itemId = monster.loot - 1;
	else {
		const hotspots = zone.hotspots
			.withType(Hotspot.Type.DropQuestItem)
			.filter(htsp => htsp.arg > 0);

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
			return Character.FrameEntry.Down;
		case Direction.North:
		case Direction.NorthEast:
		case Direction.NorthWest:
			return Character.FrameEntry.Up;
		case Direction.East:
			return Character.FrameEntry.Right;
		case Direction.West:
			return Character.FrameEntry.Left;
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

	const direction = Direction.Confine(hero.direction, false);
	const weaponHasProjectile = !!hero.weapon.frames[0].left;
	const targets = (
		weaponHasProjectile
			? [hero.location.byAdding(Direction.CalculateRelativeCoordinates(direction, frames + 1))]
			: [
					hero.location.byAdding(Direction.CalculateRelativeCoordinates(direction, 1)),
					hero.location.byAdding(Direction.CalculateRelativeCoordinates(direction - 45, 1)),
					hero.location.byAdding(Direction.CalculateRelativeCoordinates(direction + 50, 1))
			  ]
	).filter(p => zone.bounds.contains(p));

	if (targets.length === 0) {
		hero.isAttacking = false;
		hero._actionFrames = 0;
		return ScriptResult.Done;
	}

	const hitMonsters = zone.monsters.filter(
		({ position, alive, enabled }) =>
			alive && enabled && targets.some(target => position.isEqualTo(target))
	);

	hitMonsters.forEach(monster => hitMonster(monster, hero.weapon, zone, assets));
	if (hitMonsters.length) {
		hero.isAttacking = false;
		hero._actionFrames = 0;
		return ScriptResult.Done;
	}

	const tile = zone.getTile(targets[0]);
	if (!bulletTileForBullet(engine)) return ScriptResult.Done;

	if (!tile || tile.isOpaque()) {
		// evaluate scripts
		engine.inputManager.placedTileLocation = targets[0];
		engine.inputManager.placedTile =
			hero.weapon.frames[0].tiles[Character.FrameEntry.ExtensionRight];
		engine.spu.prepareExecution(EvaluationMode.PlaceItem, zone);
		const result = await engine.spu.run();
		return result;
	}

	hero.isAttacking = false;
	hero._actionFrames = 0;
	// TODO: damage npc
};
