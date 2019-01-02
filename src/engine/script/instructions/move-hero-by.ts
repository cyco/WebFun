import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x13,
	Arguments: [Type.Number, Type.Number, Type.Number, Type.Number, Type.Number],
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.hero.location.x += instruction.arguments[0];
		engine.hero.location.y += instruction.arguments[1];

		// original implementation actually has a hard break here
		return Result.Void;
	}
};
