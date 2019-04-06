import { Type, int16 } from "../types";

import Condition from "src/engine/script/condition";
import Engine from "../../engine";
import { HotspotType } from "src/engine/objects";
import Zone from "../../objects/zone";

export default {
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
} as Condition;
