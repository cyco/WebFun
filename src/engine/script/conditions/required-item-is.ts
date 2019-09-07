import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x0e,
	Arguments: [Type.TileID],
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const { requiredItem } = engine.currentWorld.findSectorContainingZone(zone);
		return args[0] === requiredItem.id;
	}
};
