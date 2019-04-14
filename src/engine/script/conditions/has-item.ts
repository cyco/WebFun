import { Type, int16 } from "../types";

import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x0d,
	Arguments: [Type.TileID],
	Description:
		"True if inventory contains `arg_0`.\nIf `arg_0` is `-1` check if inventory contains the item provided by the current zone's puzzle",
	Implementation: async (args: int16[], _: Zone, engine: Engine): Promise<boolean> => {
		// TODO: fix implementation
		// const itemId = args[0] !== -1 ? args[0] : zone.puzzleGain;
		const itemId = args[0] !== -1 ? args[0] : -1;
		return engine.inventory.contains(itemId);
	}
};
