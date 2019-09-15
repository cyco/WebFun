import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x0d,
	Arguments: [Type.TileID],
	Description:
		"True if inventory contains `arg_0`.\nIf `arg_0` is `-1` check if inventory contains the item provided by the current zone's puzzle",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		let itemId: number = args[0];
		if (itemId === -1) {
			const sector = engine.currentWorld.findSectorContainingZone(zone);
			if (sector.findItem) itemId = sector.findItem.id;
		}

		return engine.inventory.contains(itemId);
	}
};
