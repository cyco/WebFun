import Engine from "../engine";
import Action from "../objects/action";
import Instruction from "../objects/instruction";
import Instructions from "./instructions";
import { Result } from "src/engine/script/arguments";

class InstructionExecutor {
	public engine: Engine;
	public action: Action = null;

	constructor(engine: Engine = null) {
		this.engine = engine;
	}

	async execute(instruction: Instruction): Promise<Result> {
		const handler = Instructions[instruction.opcode];
		console.assert(!!handler, `Unknown instruction opcode 0x${instruction.opcode.toString(0x10)}!`);
		return await handler(instruction, this.engine, this.action);
	}
}

export default InstructionExecutor;
