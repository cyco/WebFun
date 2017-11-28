import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x14,
	Arguments: [],
	Description: "Disable current action",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		// original implementation disables action only if no redraw occurs
		action.enabled = false;
		return ResultFlags.OK;
	}
};
