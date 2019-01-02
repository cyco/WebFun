import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x0e,
	Arguments: [Type.Number],
	Description: "Add `arg_0` to current zone's `counter` value",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.currentZone.counter += instruction.arguments[0];

		return Result.Void;
	}
};
