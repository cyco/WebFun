import { NPC, Zone, CharMovementType } from "../objects";
import { Point, Size } from "src/util";
import { findAnimationTileIdForCharFrame } from "./helpers";
import { Engine } from "src/engine";
import CharSetDefaultFace from "./helpers/char-set-default-face";
import YodaViewRedrawTile from "./helpers/yoda-view-redraw";
import ZoneSetTileAt from "./helpers/zone-set-tile-at";

function updateFaceAndRedraw(npc: NPC, zone: Zone, engine: Engine) {
	const tile = findAnimationTileIdForCharFrame(npc.face.frames.first(), npc.facingDirection);
	ZoneSetTileAt(engine, zone, npc.position, tile.id);
	npc.facingDirection++;
	npc.facingDirection %= 6;
}

function maybeRestoreFaceThenDraw(npc: NPC, direction: Point, zone: Zone, engine: Engine) {
	if (npc.flag34) {
		CharSetDefaultFace(npc.face, direction);
		npc.flag34 = false;
	}
	return updateFaceAndRedraw(npc, zone, engine);
}

export default (npc: NPC, zone: Zone, engine: Engine) => {
	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const direction = hero
		.bySubtracting(npc.position)
		.dividedBy(new Size(distanceToHero.x, distanceToHero.y));
	direction.x |= 0;
	direction.y |= 0;

	if (!npc.face) {
		// TODO: this was break and might have jumped to handle bullet
		YodaViewRedrawTile(npc.position, zone);
		return;
	}

	console.assert(npc.face.movementType !== CharMovementType.Unspecific3);

	if (direction.x || direction.y) {
		return maybeRestoreFaceThenDraw(npc, direction, zone, engine);
	}

	if (npc.x === hero.x) {
		direction.x = -1;
		if (npc.x <= hero.x) direction.x = 0;
	} else {
		if (npc.y !== hero.y) {
			return maybeRestoreFaceThenDraw(npc, direction, zone, engine);
		}
		if (npc.x >= hero.x) {
			direction.x = -1;
			if (npc.x <= hero.x) direction.x = 0;
		} else {
			direction.x = 1;
		}
	}
	if (npc.y >= hero.y) {
		direction.y = -1;
		if (npc.y <= hero.y) direction.y = 0;
	} else {
		direction.y = 1;
	}
	CharSetDefaultFace(npc.face, direction);
	return maybeRestoreFaceThenDraw(npc, direction, zone, engine);
};
