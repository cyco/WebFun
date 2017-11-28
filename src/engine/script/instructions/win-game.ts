import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x1f,
	Arguments: [],
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		throw "Game Won!";
	}
};
