import { Type as HotspotType } from "/engine/objects/hotspot";

export const Opcode = 0x1d;
export const Arguments = 2;
export default (args, zone, engine) => {
	for (let hotspot of zone.hotspots) {
		if (hotspot.type === HotspotType.TriggerLocation &&
			hotspot.x === args[0] &&
			hotspot.y === args[1] &&
			hotspot.enabled) {
			return true;
		}
	}
	return false;
};
