import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Flags as Result, InstructionResult } from "../arguments";

export const Opcode = 0x02;
export const Arguments = 5;
export const Description = "Move Tile at `arg_0`x`arg_0`x`arg_2` to `arg_3`x`arg_4`x`arg_2`. *Note that this can not be used to move tiles between layers!*";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	const args = instruction.arguments;
	const zone = engine.currentZone;

	zone.moveTile(args[0], args[1], args[2], args[3], args[4]);

	return Result.UpdateTiles;
};
