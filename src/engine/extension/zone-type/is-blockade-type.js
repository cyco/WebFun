import { Type as ZoneType } from "../../objects/zone";

const isBlockadeType = function () {
	switch (this) {
		case ZoneType.BlockadeNorth:
		case ZoneType.BlockadeEast:
		case ZoneType.BlockadeWest:
		case ZoneType.BlockadeSouth:
			return true;
		default:
			return false;
	}
};

Number.prototype.isBlockadeType = isBlockadeType;
export default isBlockadeType;
