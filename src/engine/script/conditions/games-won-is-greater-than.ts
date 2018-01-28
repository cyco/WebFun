import Engine from "../../engine";
import Zone from "../../objects/zone";
import { int16, Type } from "../types";
import Condition from "src/engine/script/condition";

export default <Condition>{
	Opcode: 0x23,
	Arguments: [Type.Number],
	Description: "Total games won is greater than `arg_0`",
	Implementation: async (args: int16[], zone: Zone, engine: Engine): Promise<boolean> =>
		engine.persistentState.gamesWon > args[0]
};
