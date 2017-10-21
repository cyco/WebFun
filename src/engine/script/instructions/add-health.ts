import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Flags, InstructionResult } from "../arguments";

export const Opcode = 0x25;
export const Arguments = 1;
export const Description = "Increase hero's health by `arg_0`. New health is capped at hero's max health (0x300).";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	engine.hero.health += instruction.arguments[0];
	return Flags.UpdateHealth;
};
