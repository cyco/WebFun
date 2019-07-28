import { NPC, Zone, Char, Sound } from "src/engine/objects";
import { Point, rand } from "src/util";
import { Engine } from "src/engine";
import { NullIfMissing } from "src/engine/asset-manager";
import moveCheck from "./move-check";
import MoveCheckResult from "./move-check-result";
import { Yoda } from "src/engine/type";
import findTileIdForCharFrameWithDirection from "./find-tile-id-for-char-frame-with-direction";

export default (npc: NPC, zone: Zone, engine: Engine): boolean => {
	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(npc.position);

	const weapon = engine.assetManager.get(Char, npc.face.reference, NullIfMissing);
	if (!weapon) return true;

	let playShootSound = false;
	let canActuallyMove = false;

	if (npc.field3c || npc.cooldown > 0) {
	} else if (npc.enabled && distanceToHero.x < 4 && distanceToHero.y < 4) {
		npc.bullet = new Point(npc.position);
		npc.direction = directionToHero;
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

	const direction = npc.direction;
	const tile = findTileIdForCharFrameWithDirection(weapon.frames[0], direction);

	npc.field3c++;

	if (moveCheck(npc.bullet, direction, zone, false) === MoveCheckResult.Free) {
		if (!npc.bullet.byAdding(direction).isEqualTo(hero)) {
			canActuallyMove = true;
			npc.bullet = npc.bullet.byAdding(direction);
			if (npc.field3c === 1 && playShootSound) {
				const sound = engine.assetManager.get(Sound, weapon.reference);
				engine.mixer.effectChannel.playSound(sound);
			}
		} else {
			engine.hero.health -= npc.face.damage;
			const sound = engine.assetManager.get(Sound, Yoda.sounds.Hurt);
			engine.mixer.effectChannel.playSound(sound);
			canActuallyMove = false;
		}
	} else {
		canActuallyMove = false;
	}

	if (canActuallyMove && npc.field3c < 4) {
		console.log("direction", direction.x, direction.y);
		zone.setTile(null, npc.bullet.x - direction.x, npc.bullet.y - direction.y, Zone.Layer.Object);
		// YodaView::RedrawTile(view, *bulletXRef - *y_2, *bulletYRef - *y_5);
		zone.setTile(tile, npc.bullet.x, npc.bullet.y, Zone.Layer.Object);
		// YodaView::RedrawTile(view, *bulletXRef, *bulletYRef);
		return true;
	} else {
		if (zone.getTile(npc.bullet.x, npc.bullet.y, Zone.Layer.Object) === tile) {
			zone.setTile(null, npc.bullet.x, npc.bullet.y, Zone.Layer.Object);
			// YodaView::RedrawTile(view, *bulletXRef - *y_2, *bulletYRef - *y_5);
		}
		npc.field3c = 0;
		npc.bullet = new Point(npc.position);
		return false;
	}
};
