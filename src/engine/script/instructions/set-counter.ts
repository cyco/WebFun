import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x0d,
	Arguments: [Type.Number],
	Description: "Set current zone's `counter` value to a `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.currentZone.counter = instruction.arguments[0];

		return ResultFlags.OK;
	}
};
