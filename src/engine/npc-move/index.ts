import { Char, NPC, Zone } from "src/engine/objects";
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

function handleRemainingBullet(npc: NPC, zone: Zone, engine: Engine) {
	const hero = engine.hero.location;
	const character = engine.assetManager.get(Char, npc.face.id, NullIfMissing);
	if (!character) return;
	const weapon = engine.assetManager.get(Char, character.reference, NullIfMissing);

	if (!weapon) return;

	const tile = findTileIdForCharFrameWithDirection(weapon.frames[0], npc.direction);
	if (zone.getTile(npc.bullet.x, npc.bullet.y, Zone.Layer.Object) === tile) {
		if (!npc.bullet.isEqualTo(hero)) {
			ZoneSetTileAt(engine, zone, npc.bullet, -1);
			YodaViewRedrawTile(npc.bullet, zone);
		}
	}
	npc.field3c = 0;
	npc.bullet = new Point(npc.position);
	npc.direction = new Point(0, 0);
}

export default (npc: NPC, zone: Zone, engine: Engine): void => {
	if (!npc.face) return;
	if (!npc.enabled) {
		handleRemainingBullet(npc, zone, engine);
		return;
	}

	if (shoot(npc, zone, engine)) {
		CharSetDefaultFace(npc.face, npc.direction);
		YodaViewRedrawTile(npc.position, zone);
		return;
	}

	const moveFn = dispatch.get(npc.face.movementType) || null;
	if (moveFn) return moveFn(npc, zone, engine);
};
