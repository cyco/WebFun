import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x0b,
	Arguments: [],
	Description: "Stop playing sounds. _TODO: check if only music need to be stopped`",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		return ResultFlags.UpdateSound;
	}
};
