import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x02,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.ZoneZ, Type.ZoneX, Type.ZoneY],
	Description: "Move Tile at `arg_0`x`arg_0`x`arg_2` to `arg_3`x`arg_4`x`arg_2`. *Note that this can not be used to move tiles between layers!*",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		const args = instruction.arguments;
		const zone = engine.currentZone;

		zone.moveTile(args[0], args[1], args[2], args[3], args[4]);

		return ResultFlags.UpdateTiles;
	}
};
