import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x20,
	Arguments: [],
	Implementation: async (_instruction: Instruction, _engine: Engine, _: Action): Promise<Result> => {
		throw "Game Lost!";
	}
};
