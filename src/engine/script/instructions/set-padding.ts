import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x22,
	Arguments: [Type.Number],
	Description: "Set current zone's `padding` value to a `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.currentZone.padding = instruction.arguments[0];
		return Result.OK;
	}
};
