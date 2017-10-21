import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x00;
export const Arguments = 4;
export const Description = "Place tile `arg_3` at `arg_0`x`arg_1`x`arg_2`. To remove a tile the id -1 is used.";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	const args = instruction.arguments;
	const zone = engine.currentZone;

	const tile = engine.data.tiles[args[3]];
	zone.setTile(tile, args[0], args[1], args[2]);

	return ResultFlags.UpdateTiles;
};
