import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x24,
	Arguments: [Type.Number],
	Description: "Set current zone's `random` value to a `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		engine.currentZone.random = instruction.arguments[0];
		return Result.OK;
	}
};
