import * as Result from "../result";

export const Opcode = 0x0c;
export const Arguments = 1;
export default (instruction, engine, action) => {
	//  zone->random = rand() % instruction->arg1 + 1
	// TODO: consider using { rand } from '/util'
	const args = instruction.arguments;
	const zone = engine.currentZone;
	zone.random = Math.round(Math.random() * args[0]) % args[0];
	return Result.OK;
};
