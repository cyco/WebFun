import { Action, Condition, Instruction } from "src/engine/objects";
import AST, { s } from "./ast";

import { ConditionsByName } from "src/engine/script/conditions";
import { InstructionsByName } from "src/engine/script/instructions";

class Disassembler {
	public disassemble(input: Action): AST {
		return [s`defaction`, ...(input.name.length ? [input.name] : []),
			[s`and`,
				...input.conditions.map(c => this._disassembleCondition(c)),
				[s`progn`, ...input.instructions.map(c => this._disassembleInstruction(c))]
			]];
	}

	private _disassembleCondition(condition: Condition): AST[] {
		const name = Object.keys(ConditionsByName).find(key => (<any>ConditionsByName)[key].Opcode === condition.opcode) || `${condition.opcode}`;
		const Condition = name ? (<any>ConditionsByName)[name] : null;

		const argCount = Condition.Arguments.length;
		const usedArguments = condition.arguments.slice(0, argCount);

		return [s`${name.dasherize()}`, ...usedArguments];
	}

	private _disassembleInstruction(instruction: Instruction): AST[] {
		const name = Object.keys(InstructionsByName).find(key => (<any>InstructionsByName)[key].Opcode === instruction.opcode) || `${instruction.opcode}`;
		const Instruction = name ? (<any>InstructionsByName)[name] : null;

		const argCount = Instruction.Arguments.length;
		const usedArguments = instruction.arguments.slice(0, argCount);

		return [s`${name.dasherize()}`, ...usedArguments, ...(Instruction.UsesText ? [instruction.text] : [])];
	}

}

export default Disassembler;
