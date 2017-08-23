import * as Type from "../../types";
import { Type as HotspotType } from "../../objects/hotspot";

const toHotspotType = function () {
	if (this & Type.TILE_SPEC_THE_FORCE) {
		return HotspotType.ForceLocation;
	} else if (this & Type.TILE_SPEC_MAP) {
		return HotspotType.LocatorThingy;
	} else if (this & Type.TILE_SPEC_USEFUL) {
		return HotspotType.TriggerLocation;
	}

	throw `Tile specification ${this} can't be associated with a hotspot`;
};
Number.prototype.toHotspotType = toHotspotType;
export default toHotspotType;
