import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";
import { Result } from "../types";

export default {
	Opcode: 0x1f,
	Arguments: [],
	Implementation: async (_: Instruction, _engine: Engine, _action: Action): Promise<Result> => {
		throw "Game Won!";
	}
} as InstructionType;
