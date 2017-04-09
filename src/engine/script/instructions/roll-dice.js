import * as Result from "../result";

export default (instruction, engine, action) => {
	//  zone->random = rand() % instruction->arg1 + 1
	// TODO: consider using { rand } from '/util'
	const args = instruction.arguments;
	const zone = engine.currentZone;
	zone.random = Math.round(Math.random() * args[0]) % args[0];
	return Result.OK;
};
