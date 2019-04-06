import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";
import { Result } from "../types";

export default {
	Opcode: 0x08,
	Arguments: [],
	Description: "Pause script execution for one tick.",
	Implementation: async (_1: Instruction, _2: Engine, _3: Action): Promise<Result> => {
		return Result.Wait;
	}
} as InstructionType;
