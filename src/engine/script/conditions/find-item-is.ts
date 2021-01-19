import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x16,
	Arguments: [Type.TileID],
	Description: "True the item provided by current zone is `arg_0`",
	Implementation: async ([itemId]: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const sector = engine.currentWorld.findSectorContainingZone(zone);
		return sector.findItem !== null && sector.findItem.id === itemId;
	}
};
