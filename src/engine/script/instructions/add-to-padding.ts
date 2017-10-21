import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x23;
export const Arguments = 1;
export const Description = "Add `arg_0` to current zone's `padding` value";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	engine.currentZone.padding += instruction.arguments[0];

	return ResultFlags.OK;
};
