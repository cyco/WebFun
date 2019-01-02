import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x01,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.ZoneZ],
	Description: "Remove tile at `arg_0`x`arg_1`x`arg_2`",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;
		const zone = engine.currentZone;

		zone.removeTile(args[0], args[1], args[2]);

		return Result.UpdateTiles;
	}
};
