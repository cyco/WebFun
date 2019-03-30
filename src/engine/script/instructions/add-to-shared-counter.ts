import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x23,
	Arguments: [Type.Number],
	Description: "Add `arg_0` to current zone's `shared-counter` value",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		action.zone.sharedCounter += instruction.arguments[0];

		return Result.Void;
	}
};