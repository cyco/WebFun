import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x03;
export const Arguments = -1;
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	/*
	 case DrawTileNow:
	 tile_2 = document->tiles.ptrs[instruction->arg3];
	 if ( tile_2 )
	 {
	 SetPixelsForRectWithTransparancey(
	 document->hdc_surface,
	 (int)tile_2->pixels,
	 0x20u,
	 32,
	 32 * LOWORD(instruction->arg1),
	 32 * instruction->arg2,
	 0);
	 result_1 |= UpdateTiles;
	 }
	 goto fetch_next_instruction;
	 */
	return ResultFlags.UpdateTiles;
};
