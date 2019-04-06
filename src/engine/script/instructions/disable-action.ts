import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";
import { Result } from "../types";

export default {
	Opcode: 0x14,
	Arguments: [],
	Description: "Disable current action",
	Implementation: async (_: Instruction, _engine: Engine, action: Action): Promise<Result> => {
		// original implementation disables action only if no redraw occurs
		action.enabled = false;
		return Result.Void;
	}
} as InstructionType;
