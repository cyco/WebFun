import { Monster, Zone, Char, Sound } from "src/engine/objects";
import { Point, rand } from "src/util";
import { Engine } from "src/engine";
import { NullIfMissing } from "src/engine/asset-manager";
import moveCheck from "./move-check";
import MoveCheckResult from "./move-check-result";
import { Yoda } from "src/engine/variant";
import { Channel } from "src/engine/audio";

export default (monster: Monster, zone: Zone, engine: Engine): boolean => {
	const hero = engine.hero.location;
	const distanceToHero = monster.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(monster.position);

	const weapon = engine.assets.get(Char, monster.face.reference, NullIfMissing);
	if (!weapon) return false;

	let monsterJustFired = false;
	let canActuallyMove = false;

	if (monster.bulletOffset || monster.cooldown > 0) {
	} else if (monster.enabled && monster.alive && distanceToHero.x < 4 && distanceToHero.y < 4) {
		if ((directionToHero.x && directionToHero.y) || (!directionToHero.x && !directionToHero.y)) {
			monster.bulletOffset = 0;
			monster.bullet = new Point(monster.position);
			return false;
		}

		monster.bullet = new Point(monster.position);
		monster.direction = directionToHero;

		if (rand() % 7 !== 3) {
			monster.bulletOffset = 0;
			monster.bullet = new Point(monster.position);
			return false;
		}
		monsterJustFired = true;
	} else {
		monster.bulletOffset = 0;
		monster.bullet = new Point(monster.position);
		return false;
	}

	const direction = monster.direction;
	if ((direction.x && direction.y) || (!direction.x && !direction.y)) {
		monster.bulletOffset = 0;
		monster.bullet = new Point(monster.position);
		return false;
	}

	if (!monsterJustFired && monster.bulletOffset === 0) {
		return false;
	}

	if (moveCheck(monster.bullet, direction, zone, false, engine) === MoveCheckResult.Free) {
		monster.bulletOffset++;
		if (!monster.bullet.byAdding(direction).isEqualTo(hero)) {
			canActuallyMove = true;
			monster.bullet = monster.bullet.byAdding(direction);
			if (monster.bulletOffset === 1 && monsterJustFired) {
				const sound = engine.assets.get(Sound, weapon.reference);
				engine.mixer.play(sound, Channel.Effect);
			}
		} else {
			engine.hero.changeHealth(-monster.face.damage);
			const sound = engine.assets.get(Sound, Yoda.sounds.Hurt);
			engine.mixer.play(sound, Channel.Effect);
			canActuallyMove = false;
		}
	} else {
		monster.bulletOffset++;
		canActuallyMove = false;
	}

	if (canActuallyMove && monster.bulletOffset < 4) {
		// YodaView::RedrawTile(view, *bulletXRef - *y_2, *bulletYRef - *y_5);
		// YodaView::RedrawTile(view, *bulletXRef, *bulletYRef);
		return true;
	} else {
		monster.bulletOffset = 0;
		monster.bullet = new Point(monster.position);
		return false;
	}
};
