import * as Result from "../result";

export const Opcode = 0x08;
export const Arguments = -1;
export default (instruction, engine, action) => {
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

	return true;
};
