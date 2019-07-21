import { NPC, Zone, CharMovementType } from "src/engine/objects";
import { Point, Size } from "src/util";
import { Engine } from "src/engine";
import YodaViewRedrawTile from "./yoda-view-redraw";
import CharSetDefaultFace from "./char-set-default-face";
import ZoneSetTileAt from "./zone-set-tile-at";

function maybeRestoreFaceThenDraw(npc: NPC, direction: Point, zone: Zone) {
	if (npc.flag34) {
		CharSetDefaultFace(npc.face, direction);
		npc.flag34 = false;
	}
	YodaViewRedrawTile(npc.position, zone);
}

export default (npc: NPC, direction: Point, move: boolean, zone: Zone, engine: Engine) => {
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

	console.assert(npc.face.movementType !== CharMovementType.Animation);
	console.assert(npc.face.movementType !== CharMovementType.Unspecific3);

	if (direction.x || direction.y) {
		if (move) {
			ZoneSetTileAt(engine, zone, npc.position.bySubtracting(direction), -1);
			YodaViewRedrawTile(npc.position.bySubtracting(direction), zone);
			CharSetDefaultFace(npc.face, direction);
		} else if (npc.flag34) {
			CharSetDefaultFace(npc.face, direction);
			npc.flag34 = false;
		}
		return maybeRestoreFaceThenDraw(npc, direction, zone);
	}

	if (npc.x === hero.x) {
		direction.x = -1;
		if (npc.x <= hero.x) direction.x = 0;
	} else {
		if (npc.y !== hero.y) {
			return maybeRestoreFaceThenDraw(npc, direction, zone);
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
	return maybeRestoreFaceThenDraw(npc, direction, zone);
};
