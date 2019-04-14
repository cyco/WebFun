import Engine from "../../engine";
import Zone from "../../objects/zone";
import { Type, int16 } from "../types";
import Condition from "src/engine/script/condition";

export default {
	Opcode: 0x23,
	Arguments: [Type.Number],
	Description: "Total games won is greater than `arg_0`",
	Implementation: async (args: int16[], _: Zone, engine: Engine): Promise<boolean> =>
		engine.persistentState.gamesWon > args[0]
} as Condition;
