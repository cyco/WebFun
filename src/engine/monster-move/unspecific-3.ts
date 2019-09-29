import { Monster, Zone, Sound } from "../objects";
import { Point, randmod } from "src/util";
import randomDirection from "./helpers/random-direction";
import { evade, canPerformMeleeAttack, moveCheck, playSound, isDoorway } from "./helpers";
import { Engine } from "src/engine";
import YodaViewRedrawTile from "./helpers/yoda-view-redraw";
import CharSetDefaultFace from "./helpers/char-set-default-face";
import ZoneSetTileAt from "./helpers/zone-set-tile-at";

function _noMovement(monster: Monster, zone: Zone, engine: Engine) {
	_performMove(new Point(0, 0), monster, false, zone, engine);
}

function _performMeleeAttackIfUnarmed(hit: boolean, monster: Monster, zone: Zone, engine: Engine) {
	if (monster.face.reference < 0 && monster.face.damage >= 0 && hit) {
		playSound(engine.assets.get(Sound, engine.type.sounds.Hurt), engine);
		engine.hero.changeHealth(-monster.face.damage);
	}
	return _noMovement(monster, zone, engine);
}

function _performMove(direction: Point, monster: Monster, move: boolean, zone: Zone, engine: Engine) {
	const hero = engine.hero.location;
	const directionToHero = hero.comparedTo(monster.position);

	if (!monster.face) {
		// TODO: this was break and might have jumped to handle bullet
		YodaViewRedrawTile(monster.position, zone);
		return;
	}

	if (direction.x || direction.y) {
		if (move) {
			ZoneSetTileAt(engine, zone, monster.position.bySubtracting(direction), -1);
			YodaViewRedrawTile(monster.position.bySubtracting(direction), zone);
		}
		CharSetDefaultFace(monster.face, direction);
	} else {
		direction = directionToHero;
		CharSetDefaultFace(monster.face, direction);
	}
	// ZoneSetTileAt(zone, monster.position, char.current_face);
	YodaViewRedrawTile(monster.position, zone);
}

function _performMoveAfterDoorwayCheck(direction: Point, monster: Monster, zone: Zone, engine: Engine) {
	const target = monster.position.byAdding(direction);
	if (zone.getTile(target.x, target.y, Zone.Layer.Object)) return _noMovement(monster, zone, engine);
	let move = false;
	if (!isDoorway(zone, target)) move = true;
	if (move) {
		monster.position.add(direction);
	} else {
		direction = new Point(0, 0);
	}

	return _performMove(direction, monster, move, zone, engine);
}

export default (monster: Monster, zone: Zone, engine: Engine) => {
	if (monster.cooldown) {
		monster.cooldown--;
		return _noMovement(monster, zone, engine);
	}

	if (!randmod(2)) return _noMovement(monster, zone, engine);

	let direction: Point;
	const hero = engine.hero.location;
	const distanceToHero = monster.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(monster.position);

	if (distanceToHero.x < 2 && distanceToHero.y < 2 && randmod(2)) {
		direction = directionToHero;
	} else {
		direction = randomDirection();
	}

	direction = evade(direction, moveCheck(monster.position, direction, zone, false));

	if (canPerformMeleeAttack(direction, monster, hero)) {
		return _performMeleeAttackIfUnarmed(true, monster, zone, engine);
	}

	return _performMoveAfterDoorwayCheck(direction, monster, zone, engine);
};
