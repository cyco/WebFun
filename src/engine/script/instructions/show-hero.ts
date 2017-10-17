import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export const Opcode = 0x11;
export const Arguments = 0;
export const Description = "Show hero";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	engine.hero.visible = true;
	return Result.UpdateHero;
};
