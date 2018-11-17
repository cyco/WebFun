import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x1e,
	Arguments: [],
	Implementation: async (_: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		engine.currentZone.solved = true;
		return ResultFlags.OK;
	}
};
