import { int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x12,
	Description: "Returns true if the hero has the goal item",
	Arguments: [],
	Implementation: async (_args: int16[], _zone: Zone, engine: Engine): Promise<boolean> => {
		const goalItem = engine.story?.goal?.item1;
		if (!goalItem) return false;

		return engine.inventory.contains(goalItem);
	}
};
