import Instructions from "./instructions";
import Instruction from "../objects/instruction";
import Engine from "../engine";
import Action from "../objects/action";

class InstructionExecutor {
	public engine: Engine;
	public action: Action = null;

	constructor(engine: Engine = null) {
		this.engine = engine;
	}

	execute(instruction: Instruction) {
		const handler = Instructions[instruction.opcode];
		console.assert(!!handler, `Unknown instruction opcode 0x${instruction.opcode.toString(0x10)}!`);

		return handler(instruction, this.engine, this.action);
	}
}

export default InstructionExecutor;
