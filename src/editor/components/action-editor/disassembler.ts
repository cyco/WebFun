import { Action, Condition, Instruction } from "src/engine/objects";
import AST, { s } from "./ast";

import * as Conditions from "src/engine/script/conditions";
import * as Instructions from "src/engine/script/instructions";

class Disassembler {
	public disassemble(input: Action): AST {
		return [s`defaction`, ...(input.name.length ? [input.name] : []),
			[s`and`,
				...input.conditions.map(c => this._disassembleCondition(c)),
				[s`progn`, ...input.instructions.map(c => this._disassembleInstruction(c))]
			]];
	}

	private _disassembleCondition(condition: Condition): AST[] {
		const name = Object.keys(Conditions).find(key => (<any>Conditions)[key].Opcode === condition.opcode) || `${condition.opcode}`;
		const Condition = name ? (<any>Conditions)[name] : null;

		const argCount = ~Condition.Arguments ? Condition.Arguments : 5;
		const usedArguments = condition.arguments.slice(0, argCount);

		return [s`${name.dasherize()}`, ...usedArguments];
	}

	private _disassembleInstruction(instruction: Instruction): AST[] {
		const name = Object.keys(Instructions).find(key => (<any>Instructions)[key].Opcode === instruction.opcode) || `${instruction.opcode}`;
		const Instruction = name ? (<any>Instructions)[name] : null;

		const argCount = ~Instruction.Arguments ? Instruction.Arguments : 5;
		const usedArguments = instruction.arguments.slice(0, argCount);

		return [s`${name.dasherize()}`, ...usedArguments, ...(Instruction.UsesText ? [instruction.text] : [])];
	}

}

export default Disassembler;
