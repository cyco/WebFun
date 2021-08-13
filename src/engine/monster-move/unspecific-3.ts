import { Monster, Zone, Sound } from "../objects";
import { Point, randmod } from "src/util";
import randomDirection from "./helpers/random-direction";
import {
	evade,
	canPerformMeleeAttack,
	moveCheck,
	playSound,
	performMoveAfterDoorwayCheck
} from "./helpers";
import { Engine } from "src/engine";
import YodaViewRedrawTile from "./helpers/yoda-view-redraw";
import CharSetDefaultFace from "./helpers/character-set-default-face";
import ZoneSetTileAt from "./helpers/zone-set-tile-at";

function _noMovement(monster: Monster, zone: Zone, engine: Engine) {
	_performMove(monster, new Point(0, 0), false, zone, engine);
}

function _performMeleeAttackIfUnarmed(hit: boolean, monster: Monster, zone: Zone, engine: Engine) {
	if (monster.face.reference < 0 && monster.face.damage >= 0 && hit) {
		playSound(engine.assets.get(Sound, engine.variant.sounds.Hurt), engine);
		engine.hero.changeHealth(-monster.face.damage, engine.settings);
	}
	return _noMovement(monster, zone, engine);
}

function _performMove(
	monster: Monster,
	direction: Point,
	move: boolean,
	zone: Zone,
	engine: Engine
) {
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

export default (monster: Monster, zone: Zone, engine: Engine): void => {
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

	direction = evade(direction, moveCheck(monster.position, direction, zone, false, engine));

	if (canPerformMeleeAttack(direction, monster, hero)) {
		return _performMeleeAttackIfUnarmed(true, monster, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, monster, zone, engine, _performMove);
};
