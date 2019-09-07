import { NPC, Zone, Char } from "src/engine/objects";
import { Point } from "src/util";
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

	if (!npc.face) {
		// TODO: this was break and might have jumped to handle bullet
		YodaViewRedrawTile(npc.position, zone);
		return;
	}

	console.assert(npc.face.movementType !== Char.MovementType.Animation);
	console.assert(npc.face.movementType !== Char.MovementType.Unspecific3);

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

	const directionToHero = hero.comparedTo(npc.position);
	if (directionToHero.x !== 0 && directionToHero.y !== 0) {
		return maybeRestoreFaceThenDraw(npc, direction, zone);
	}
	direction = directionToHero;

	CharSetDefaultFace(npc.face, direction);
	return maybeRestoreFaceThenDraw(npc, direction, zone);
};
