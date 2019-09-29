import { Monster, Zone, Char } from "src/engine/objects";
import { Point } from "src/util";
import { Engine } from "src/engine";
import YodaViewRedrawTile from "./yoda-view-redraw";
import CharSetDefaultFace from "./char-set-default-face";
import ZoneSetTileAt from "./zone-set-tile-at";

function maybeRestoreFaceThenDraw(monster: Monster, direction: Point, zone: Zone) {
	if (monster.flag34) {
		CharSetDefaultFace(monster.face, direction);
		monster.flag34 = false;
	}
	YodaViewRedrawTile(monster.position, zone);
}

export default (monster: Monster, direction: Point, move: boolean, zone: Zone, engine: Engine) => {
	const hero = engine.hero.location;

	if (!monster.face) {
		// TODO: this was break and might have jumped to handle bullet
		YodaViewRedrawTile(monster.position, zone);
		return;
	}

	console.assert(monster.face.movementType !== Char.MovementType.Animation);
	console.assert(monster.face.movementType !== Char.MovementType.Unspecific3);

	if (direction.x || direction.y) {
		if (move) {
			ZoneSetTileAt(engine, zone, monster.position.bySubtracting(direction), -1);
			YodaViewRedrawTile(monster.position.bySubtracting(direction), zone);
			CharSetDefaultFace(monster.face, direction);
		} else if (monster.flag34) {
			CharSetDefaultFace(monster.face, direction);
			monster.flag34 = false;
		}
		return maybeRestoreFaceThenDraw(monster, direction, zone);
	}

	const directionToHero = hero.comparedTo(monster.position);
	if (directionToHero.x !== 0 && directionToHero.y !== 0) {
		return maybeRestoreFaceThenDraw(monster, direction, zone);
	}
	direction = directionToHero;

	CharSetDefaultFace(monster.face, direction);
	return maybeRestoreFaceThenDraw(monster, direction, zone);
};
