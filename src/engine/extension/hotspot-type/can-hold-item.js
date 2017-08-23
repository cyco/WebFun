import { Type as HotspotType } from "../../objects/hotspot";

const canHoldItem = function () {
	switch (this) {
		case HotspotType.CrateItem:
		case HotspotType.PuzzleNPC:
		case HotspotType.CrateWeapon:
			return true;
		default:
			return false;
	}
};
Number.prototype.canHoldItem = canHoldItem;
export default canHoldItem;
