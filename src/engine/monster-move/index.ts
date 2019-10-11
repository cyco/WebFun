import { Char, Monster, Zone } from "src/engine/objects";
import { Point } from "src/util";
import { Engine } from "src/engine";
import { findTileIdForCharFrameWithDirection, shoot } from "./helpers";
import { NullIfMissing } from "src/engine/asset-manager";
import ZoneSetTileAt from "./helpers/zone-set-tile-at";
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
import CharSetDefaultFace from "./helpers/char-set-default-face";

const dispatch = new Map([
	[Char.MovementType.Unspecific1, unspecific1],
	[Char.MovementType.Unspecific2, unspecific2],
	[Char.MovementType.Unspecific3, unspecific3],
	[Char.MovementType.Sit, sit],
	[Char.MovementType.Unspecific4, unspecific4],
	[Char.MovementType.Unspecific5, unspecific5],
	[Char.MovementType.Droid, droid],
	[Char.MovementType.Wander, wander],
	[Char.MovementType.Patrol, patrol],
	[Char.MovementType.Scaredy, scaredy],
	[Char.MovementType.Animation, animation]
	// [Char.MovementType.UnknownIndyOnly, unknownIndyOnly]
]);

function handleRemainingBullet(monster: Monster, zone: Zone, engine: Engine) {
	const hero = engine.hero.location;
	const character = engine.assets.get(Char, monster.face.id, NullIfMissing);
	if (!character) return;

	const weapon = engine.assets.get(Char, character.reference, NullIfMissing);
	if (!weapon) return;

	const tile = findTileIdForCharFrameWithDirection(weapon.frames[0], monster.direction);
	if (zone.getTile(monster.bullet.x, monster.bullet.y, Zone.Layer.Object) === tile) {
		if (!monster.bullet.isEqualTo(hero)) {
			ZoneSetTileAt(engine, zone, monster.bullet, -1);
			YodaViewRedrawTile(monster.bullet, zone);
		}
	}
	monster.field3c = 0;
	monster.bullet = new Point(monster.position);
	monster.direction = new Point(0, 0);
}

export default (monster: Monster, zone: Zone, engine: Engine): void => {
	if (!monster.face) return;
	if (!monster.enabled) {
		handleRemainingBullet(monster, zone, engine);
		CharSetDefaultFace(monster.face, monster.direction);
		if (zone.getTile(monster.position.x, monster.position.y, Zone.Layer.Object) === monster.face.tile) {
			console.log("clearing disabled monster off the map");
			zone.setTile(null, monster.position.x, monster.position.y, Zone.Layer.Object);
		}
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
