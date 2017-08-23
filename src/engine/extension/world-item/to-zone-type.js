import WorldItemType from "../../generation/world-item-type";
import { Type as ZoneType } from "../../objects/zone";

const toZoneType = function () {
	switch (this) {
		case WorldItemType.Spaceport:
			return ZoneType.Town;
		case WorldItemType.BlockEast:
			return ZoneType.BlockadeEast;
		case WorldItemType.BlockWest:
			return ZoneType.BlockadeWest;
		case WorldItemType.BlockNorth:
			return ZoneType.BlockadeNorth;
		case WorldItemType.BlockSouth:
			return ZoneType.BlockadeSouth;
		default:
			return ZoneType.Empty;
	}
};
Number.prototype.toZoneType = toZoneType;
export default toZoneType;
