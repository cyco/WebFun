import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x23,
	Arguments: [Type.Number],
	Description: "Add `arg_0` to current zone's `padding` value",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		engine.currentZone.padding += instruction.arguments[0];

		return ResultFlags.OK;
	}
};
