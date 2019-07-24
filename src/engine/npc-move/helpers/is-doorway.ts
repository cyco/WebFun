import { Zone } from "src/engine/objects";
import { Point } from "src/util";

export default (zone: Zone, target: Point): boolean => {
	const tile = zone.getTile(target.x, target.y, Zone.Layer.Floor);
	return tile && tile.isDoorway();
};
