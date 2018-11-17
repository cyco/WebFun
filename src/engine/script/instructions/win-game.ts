import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x1f,
	Arguments: [],
	Implementation: async (_: Instruction, _engine: Engine, _action: Action): Promise<Result> => {
		throw "Game Won!";
	}
};
