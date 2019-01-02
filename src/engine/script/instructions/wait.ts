import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x08,
	Arguments: [],
	Description: "Pause script execution for one tick.",
	Implementation: async (_1: Instruction, _2: Engine, _3: Action): Promise<Result> => {
		return Result.Wait;
	}
};
