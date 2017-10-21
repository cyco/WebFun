import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Flags, InstructionResult } from "../arguments";

export const Opcode = 0x08;
export const Arguments = -1;
export const Description = "Pause script execution for 100 * `arg_0` milliseconds.";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
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

	return Flags.Wait;
};
