import Instructions from '/engine/script/instructions';

export default class InstructionExecutor {
	constructor(engine = null) {
		this.engine = engine;
		this.action = null;

		Object.seal(this);
	}

	execute(instruction) {
		const handler = Instructions[instruction.opcode];
		if (!handler) throw `Unknown instruction opcode 0x${instruction.opcode.toString(0x10)}!`;

		return handler(instruction, this.engine, this.action);
	}
}
