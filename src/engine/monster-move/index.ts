import { Character, Monster, Zone } from "src/engine/objects";
import { Point } from "src/util";
import { Engine } from "src/engine";
import { findTileIdForCharacterFrameWithDirection, shoot } from "./helpers";
import { NullIfMissing } from "src/engine/asset-manager";
import YodaViewRedrawTile from "./helpers/yoda-view-redraw";
import unspecific1 from "./unspecific-1";
import unspecific2 from "./unspecific-2";
import sit from "./sit";
import unspecific4 from "./unspecific-4";
import unspecific5 from "./unspecific-5";
import unspecific3 from "./unspecific-3";
import droid from "./droid";
import wander from "./wander";
import patrol from "./patrol";
import scaredy from "./scaredy";
import animation from "./animation";
import CharSetDefaultFace from "./helpers/character-set-default-face";

const dispatch = new Map([
	[Character.MovementType.Unspecific1, unspecific1],
	[Character.MovementType.Unspecific2, unspecific2],
	[Character.MovementType.Unspecific3, unspecific3],
	[Character.MovementType.Sit, sit],
	[Character.MovementType.Unspecific4, unspecific4],
	[Character.MovementType.Unspecific5, unspecific5],
	[Character.MovementType.Droid, droid],
	[Character.MovementType.Wander, wander],
	[Character.MovementType.Patrol, patrol],
	[Character.MovementType.Scaredy, scaredy],
	[Character.MovementType.Animation, animation]
	// [Character.MovementType.UnknownIndyOnly, unknownIndyOnly]
]);

function handleRemainingBullet(monster: Monster, zone: Zone, engine: Engine) {
	const hero = engine.hero.location;
	const character = engine.assets.get(Character, monster.face.id, NullIfMissing);
	if (!character) return;

	const weapon = engine.assets.get(Character, character.reference, NullIfMissing);
	if (!weapon) return;

	const tile = findTileIdForCharacterFrameWithDirection(weapon.frames[0], monster.direction);
	if (zone.getTile(monster.bullet.x, monster.bullet.y, Zone.Layer.Object) === tile) {
		if (!monster.bullet.isEqualTo(hero)) {
			YodaViewRedrawTile(monster.bullet, zone);
		}
	}
	monster.bulletOffset = 0;
	monster.bullet = new Point(monster.position);
	monster.direction = new Point(0, 0);
}

export default (monster: Monster, zone: Zone, engine: Engine): void => {
	if (!monster.face) return;
	if (!monster.alive || !monster.enabled) {
		handleRemainingBullet(monster, zone, engine);
		CharSetDefaultFace(monster.face, monster.direction);
		return;
	}

	if (shoot(monster, zone, engine)) {
		CharSetDefaultFace(monster.face, monster.direction);
		YodaViewRedrawTile(monster.position, zone);
		return;
	}

	const moveFn = dispatch.get(monster.face.movementType) || null;
	if (moveFn) return moveFn(monster, zone, engine);
};
