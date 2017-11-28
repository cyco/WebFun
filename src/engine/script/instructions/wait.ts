import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x08,
	Arguments: [Type.Unused, Type.Number],
	Description: "Pause script execution for 100 * `arg_0` milliseconds.",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		/*
		 now = clock();
		 duration = 100 * instruction->arg1;
		 end = duration + now;
		 if ( duration + now > now )
		 {
		 while ( end > clock() )
		 ;
		 }
		 goto fetch_next_instruction;
		 */

		return ResultFlags.Wait;
	}
};
