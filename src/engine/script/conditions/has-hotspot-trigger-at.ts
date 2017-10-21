import { HotspotType } from "src/engine/objects";
import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16 } from "../arguments";


export const Opcode = 0x1d;
export const Arguments = 2;
export default (args: int16[], zone: Zone, engine: Engine): boolean => {
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
