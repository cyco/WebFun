import { Type, int16 } from "../types";

import Engine from "../../engine";
import { Zone } from "src/engine/objects";

export default {
	Opcode: 0x0f,
	Arguments: [Type.TileID],
	Description: "True if `arg_0` is equal to current goal item id",
	Implementation: async (args: int16[], _: Zone, engine: Engine): Promise<boolean> => engine.story.goal.item1.id === args[0]
};
