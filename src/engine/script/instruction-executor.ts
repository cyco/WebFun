import Engine from "../engine";
import Action from "../objects/action";
import Instruction from "../objects/instruction";
import { Result } from "src/engine/script/types";
import { InstructionImplementation } from "./types";

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
