import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x25,
	Arguments: [Type.Number],
	Description: "Increase hero's health by `arg_0`. New health is capped at hero's max health (0x300).",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.hero.health += instruction.arguments[0];
		return ResultFlags.UpdateHealth;
	}
};
