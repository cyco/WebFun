import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Hotspot } from "src/engine/objects";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x1d,
	Arguments: [Type.ZoneX, Type.ZoneY],
	Implementation: async (args: int16[], zone: Zone, _engine: Engine): Promise<boolean> => {
		for (const hotspot of zone.hotspots) {
			if (
				hotspot.type === Hotspot.Type.TriggerLocation &&
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
