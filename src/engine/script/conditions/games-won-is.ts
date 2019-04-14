import { Type, int16 } from "../types";

import Engine from "../../engine";
import Zone from "../../objects/zone";

export default {
	Opcode: 0x1c,
	Arguments: [Type.Number],
	Description: "Total games won is equal to `arg_0`",
	Implementation: async (args: int16[], _: Zone, engine: Engine): Promise<boolean> =>
		engine.persistentState.gamesWon === args[0]
};
