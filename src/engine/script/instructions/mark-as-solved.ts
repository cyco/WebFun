import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x1e;
export const Arguments = 0;
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	engine.currentZone.solved = true;
	return ResultFlags.OK;
};
