import Engine from "../engine";
import { Action, Instruction } from "src/engine/objects";
import { InstructionImplementation } from "./types";
import { Result } from "src/engine/script/types";

export type InstructionStore = InstructionImplementation[];

class InstructionExecutor {
	public engine: Engine;
	public action: Action = null;
	private _instructions: InstructionStore;

	constructor(instructions: InstructionStore, engine: Engine = null) {
		this._instructions = instructions;
		this.engine = engine;
	}

	async execute(instruction: Instruction): Promise<Result> {
		const handler = this._instructions[instruction.opcode];
		console.assert(!!handler, `Unknown instruction opcode 0x${instruction.opcode.toString(0x10)}!`);
		return await handler(instruction, this.engine, this.action);
	}
}

export default InstructionExecutor;
