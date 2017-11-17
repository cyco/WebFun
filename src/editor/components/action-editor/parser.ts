import AST from "src/editor/components/action-editor/ast";
import Action from "src/engine/objects/action";
import Symbol from "./symbol";
import Condition from "src/engine/objects/condition";
import Instruction from "src/engine/objects/instruction";
import * as Conditions from "src/engine/script/conditions";
import * as Instructions from "src/engine/script/instructions";

const s = (name: TemplateStringsArray, ...keys: any[]) => new Symbol(String.raw(name, ...keys));

class Parser {
	parse(input: string|Action): AST {
		if (input instanceof Action) {
			return this._parseAction(input);
		}

		return this._parseString(input);
	}

	private _parseAction(input: Action): AST {
		return [s`defn`, s`action-${input.id}`, [],
			[s`and`,
				...input.conditions.map(c => this._parseCondition(c)),
				[s`progn`, ...input.instructions.map(c => this._parseInstruction(c))]
			]];
	}

	private _parseCondition(condition: Condition): AST[] {
		const name = Object.keys(Conditions).find(key => (<any>Conditions)[key].Opcode === condition.opcode) || `${condition.opcode}`;
		const Condition = name ? (<any>Conditions)[name] : null;

		const argCount = Math.max(Condition.Arguments, 0);
		const usedArguments = condition.arguments.slice(0, argCount);

		return [s`${name.dasherize()}`, ...usedArguments];
	}

	private _parseInstruction(instruction: Instruction): AST[] {
		const name = Object.keys(Instructions).find(key => (<any>Instructions)[key].Opcode === instruction.opcode) || `${instruction.opcode}`;
		const Instruction = name ? (<any>Instructions)[name] : null;

		const argCount = Math.max(Instruction.Arguments, 0);
		const usedArguments = instruction.arguments.slice(0, argCount);

		return [s`${name.dasherize()}`, ...usedArguments, ...(Instruction.UsesText ? [`${instruction.text}`] : [])];
	}

	private _parseString(input: string): AST {
		return [];
	}
}

export default Parser;
