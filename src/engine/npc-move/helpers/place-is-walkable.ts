import { Point } from "src/util";
import { Zone } from "src/engine/objects";

export default (place: Point, zone: Zone) => {
	if (zone.getTile(place.x, place.y, Zone.Layer.Object)) return false;

	const tile = zone.getTile(place.x, place.y, Zone.Layer.Floor);
	if (!tile) return false;

	return !tile.isDoorway();
};
