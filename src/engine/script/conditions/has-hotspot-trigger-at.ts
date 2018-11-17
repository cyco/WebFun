import { HotspotType } from "src/engine/objects";
import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x1d,
	Arguments: [Type.ZoneX, Type.ZoneY],
	Implementation: async (args: int16[], zone: Zone, _engine: Engine): Promise<boolean> => {
		for (let hotspot of zone.hotspots) {
			if (
				hotspot.type === HotspotType.TriggerLocation &&
				hotspot.x === args[0] &&
				hotspot.y === args[1] &&
				hotspot.enabled
			) {
				return true;
			}
		}
		return false;
	}
};
