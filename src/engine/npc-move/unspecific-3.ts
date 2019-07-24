import { NPC, Zone, Sound } from "../objects";
import { Point, randmod, Size } from "src/util";
import randomDirection from "./helpers/random-direction";
import { evade, canPerformMeleeAttack, moveCheck, playSound, isDoorway } from "./helpers";
import { Engine } from "src/engine";
import YodaViewRedrawTile from "./helpers/yoda-view-redraw";
import CharSetDefaultFace from "./helpers/char-set-default-face";
import ZoneSetTileAt from "./helpers/zone-set-tile-at";

function _noMovement(npc: NPC, zone: Zone, engine: Engine) {
	_performMove(new Point(0, 0), npc, false, zone, engine);
}

function _performMeleeAttackIfUnarmed(hit: boolean, npc: NPC, zone: Zone, engine: Engine) {
	if (npc.face.reference < 0 && npc.face.damage >= 0 && hit) {
		playSound(engine.assetManager.get(Sound, engine.type.sounds.Hurt), engine);
		engine.hero.health -= npc.face.damage;
	}
	return _noMovement(npc, zone, engine);
}

function _performMove(direction: Point, npc: NPC, move: boolean, zone: Zone, engine: Engine) {
	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const directionToHero = hero
		.bySubtracting(npc.position)
		.dividedBy(new Size(distanceToHero.x, distanceToHero.y));
	directionToHero.x |= 0;
	directionToHero.y |= 0;

	if (!npc.face) {
		// TODO: this was break and might have jumped to handle bullet
		YodaViewRedrawTile(npc.position, zone);
		return;
	}

	if (direction.x || direction.y) {
		if (move) {
			ZoneSetTileAt(engine, zone, npc.position.bySubtracting(direction), -1);
			YodaViewRedrawTile(npc.position.bySubtracting(direction), zone);
		}
		CharSetDefaultFace(npc.face, direction);
	} else {
		direction = directionToHero;
		CharSetDefaultFace(npc.face, direction);
	}
	// ZoneSetTileAt(zone, npc.position, char.current_face);
	YodaViewRedrawTile(npc.position, zone);
}

function _performMoveAfterDoorwayCheck(direction: Point, npc: NPC, zone: Zone, engine: Engine) {
	const target = npc.position.byAdding(direction);
	if (zone.getTile(target.x, target.y, Zone.Layer.Object)) return _noMovement(npc, zone, engine);
	let move = false;
	if (!isDoorway(zone, target)) move = true;
	if (move) {
		npc.position.add(direction);
	} else {
		direction = new Point(0, 0);
	}

	return _performMove(direction, npc, move, zone, engine);
}

export default (npc: NPC, zone: Zone, engine: Engine) => {
	if (npc.cooldown) {
		npc.cooldown--;
		return _noMovement(npc, zone, engine);
	}

	if (!randmod(2)) return _noMovement(npc, zone, engine);

	let direction: Point;
	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const directionToHero = hero
		.bySubtracting(npc.position)
		.dividedBy(new Size(distanceToHero.x, distanceToHero.y));
	directionToHero.x |= 0;
	directionToHero.y |= 0;

	if (distanceToHero.x < 2 && distanceToHero.y < 2 && randmod(2)) {
		direction = directionToHero;
	} else {
		direction = randomDirection();
	}

	direction = evade(direction, moveCheck(npc.position, direction, zone, false));

	if (canPerformMeleeAttack(direction, npc, hero)) {
		return _performMeleeAttackIfUnarmed(true, npc, zone, engine);
	}

	return _performMoveAfterDoorwayCheck(direction, npc, zone, engine);
};
