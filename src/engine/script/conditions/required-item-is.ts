import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x0e,
	Arguments: [Type.TileID],
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const { requiredItem, additionalRequiredItem } =
			engine.currentWorld.findSectorContainingZone(zone);
		if (requiredItem && args[0] === requiredItem.id) return true;
		if (additionalRequiredItem && args[0] === additionalRequiredItem.id) return true;

		return false;
	}
};
