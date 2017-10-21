import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x11;
export const Arguments = 0;
export const Description = "Show hero";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	engine.hero.visible = true;
	return ResultFlags.UpdateHero;
};
