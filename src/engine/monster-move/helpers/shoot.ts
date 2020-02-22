import { Monster, Zone, Char, Sound } from "src/engine/objects";
import { Point, rand } from "src/util";
import { Engine } from "src/engine";
import { NullIfMissing } from "src/engine/asset-manager";
import moveCheck from "./move-check";
import MoveCheckResult from "./move-check-result";
import { Yoda } from "src/engine/type";
import findTileIdForCharFrameWithDirection from "./find-tile-id-for-char-frame-with-direction";
import { Channel } from "src/engine/audio";

export default (monster: Monster, zone: Zone, engine: Engine): boolean => {
	const hero = engine.hero.location;
	const distanceToHero = monster.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(monster.position);

	const weapon = engine.assets.get(Char, monster.face.reference, NullIfMissing);
	if (!weapon) return false;

	let playShootSound = false;
	let canActuallyMove = false;

	if (monster.field3c || monster.cooldown > 0) {
		//
	} else if (monster.enabled && distanceToHero.x < 4 && distanceToHero.y < 4) {
		monster.bullet = new Point(monster.position);
		monster.direction = directionToHero;
		if (directionToHero.x && directionToHero.y) {
			return false;
		}

		if (rand() % 7 !== 3) {
			return false;
		}

		playShootSound = true;
	} else {
		return false;
	}

	const direction = monster.direction;
	if (direction.x && direction.y) {
		return false;
	}
	const tile = findTileIdForCharFrameWithDirection(weapon.frames[0], direction);

	monster.field3c++;

	if (moveCheck(monster.bullet, direction, zone, false) === MoveCheckResult.Free) {
		if (!monster.bullet.byAdding(direction).isEqualTo(hero)) {
			canActuallyMove = true;
			monster.bullet = monster.bullet.byAdding(direction);
			if (monster.field3c === 1 && playShootSound) {
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
		canActuallyMove = false;
	}

	if (canActuallyMove && monster.field3c < 4) {
		zone.setTile(null, monster.bullet.x - direction.x, monster.bullet.y - direction.y, Zone.Layer.Object);
		// YodaView::RedrawTile(view, *bulletXRef - *y_2, *bulletYRef - *y_5);

		zone.setTile(tile, monster.bullet.x, monster.bullet.y, Zone.Layer.Object);
		// YodaView::RedrawTile(view, *bulletXRef, *bulletYRef);
		return true;
	} else {
		if (
			monster.field3c >= 4 &&
			zone.getTile(
				monster.bullet.x - direction.x,
				monster.bullet.y - direction.y,
				Zone.Layer.Object
			) === tile
		) {
			zone.setTile(
				null,
				monster.bullet.x - direction.x,
				monster.bullet.y - direction.y,
				Zone.Layer.Object
			);
			// YodaView::RedrawTile(view, *bulletXRef - *y_2, *bulletYRef - *y_5);
		}

		if (
			zone.bounds.contains(monster.bullet) &&
			zone.getTile(monster.bullet.x, monster.bullet.y, Zone.Layer.Object) === tile
		) {
			zone.setTile(null, monster.bullet.x, monster.bullet.y, Zone.Layer.Object);
			// YodaView::RedrawTile(view, *bulletXRef - *y_2, *bulletYRef - *y_5);
		}
		monster.field3c = 0;
		monster.bullet = new Point(monster.position);
		return false;
	}
};
