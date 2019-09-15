import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x12,
	Description: "Returns true if the user placed an item",
	Arguments: [Type.Number, Type.Number, Type.Number, Type.Number, Type.Number],
	Implementation: async (_args: int16[], _zone: Zone, engine: Engine): Promise<boolean> => {
		return !!engine.inputManager.placedTile;
	}
};
