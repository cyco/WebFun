import { Type, int16 } from "../types";

import Condition from "src/engine/script/condition";
import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x0e,
	Arguments: [Type.TileID],
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> => {
		const worldLocation = engine.currentWorld.locationOfZone(zone);
		if (!worldLocation) console.warn("can't find location of zone", zone, "on current world");
		const worldItem = engine.currentWorld.at(worldLocation);

		return args[0] === worldItem.requiredItem.id;
	}
} as Condition;
