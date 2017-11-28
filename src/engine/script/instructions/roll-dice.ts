import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x0c,
	Arguments: [Type.Number],
	Description: "Set current zone's `random` to a random value between 0 and `arg_0`. _TODO: verify this isn't $0 < random <= arg_0$.",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		//  zone->random = rand() % instruction->arg1 + 1
		// TODO: consider using { rand } from '/util'
		const args = instruction.arguments;
		const zone = engine.currentZone;
		zone.random = Math.round(Math.random() * args[0]) % args[0];
		return ResultFlags.OK;
	}
};
