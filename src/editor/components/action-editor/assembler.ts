import AST, { s } from "./ast";

import { Action, Condition, Instruction } from "src/engine/objects";
import { ConditionsByName } from "src/engine/script/conditions";
import { InstructionsByName } from "src/engine/script/instructions";
import { MutableAction } from "src/engine/mutable-objects";
import Symbol from "./symbol";
import { Type } from "src/engine/script/types";

class AssemblerInputError extends Error {
	public readonly input: AST;

	constructor(message: string, input: AST) {
		super(message);
		this.input = input;
	}
}

type ASTFunctionDefinition = [Symbol, Symbol, AST, AST[]];
interface Opcode {
	Opcode: number;
	Arguments: Type[];
	UsesText?: boolean;
	Description?: string;
}
interface OpcodeMap {
	[_: string]: Opcode;
}

const Conditions = ConditionsByName as OpcodeMap;
const Instructions = (InstructionsByName as any) as OpcodeMap;

class Assembler {
	private checkArgumentCount: boolean = false;

	public assemble(input: AST): Action {
		const result = new MutableAction();

		let [defaction, name, ...body] = this.validateInputStructure(input) as [Symbol, Symbol, ...AST[]];
		console.assert(defaction === s`defaction`);

		if (typeof name === "string") {
			result.name = name;
		} else {
			body = [name, ...body];
		}

		if (body.length === 1) {
			body = body.first() as AST[];
		}

		let conditions: Condition[] = [];
		let instructions: Instruction[] = [];
		if (!(body instanceof Array)) throw new AssemblerInputError("Expected function call", body);

		if (body.first() === s`and`) {
			[conditions, instructions] = this.parseAnd(body.slice());
		} else {
			instructions = [this.parseInstruction(body.slice())];
		}

		result.conditions = conditions;
		result.instructions = instructions;

		return result;
	}

	private validateInputStructure(input: AST): ASTFunctionDefinition {
		const inputArray = input as AST[];

		if (!(input instanceof Array)) throw new AssemblerInputError("Input must be an array.", input);
		if (inputArray[0] !== s`defaction`)
			throw new AssemblerInputError("Input must be an action definition using defaction.", input);

		return input.slice() as ASTFunctionDefinition;
	}

	private parseAnd(body: AST[]): [Condition[], Instruction[]] {
		// drop and-symbol
		const and = body.shift();
		if (and !== s`and`) throw new AssemblerInputError("Invalid input", body);

		let instructions: Instruction[];
		const progn = body.pop();
		if (!(progn instanceof Array)) throw new AssemblerInputError("Invalid input", body);
		if (progn.first() !== s`progn`) {
			instructions = [this.parseInstruction(progn)];
		} else {
			instructions = progn.slice(1).map(input => this.parseInstruction(input));
		}

		const conditions = body.map(input => this.parseCondition(input));
		return [conditions, instructions];
	}

	private parseInstruction(input: AST): Instruction {
		return Object.assign(this.parseOpcode(input, Instructions), { isInstruction: true });
	}

	private parseCondition(input: AST): Condition {
		return Object.assign(this.parseOpcode(input, Conditions), { isCondition: true });
	}

	private parseOpcode<T>(input: AST, map: OpcodeMap): any {
		if (!(input instanceof Array)) throw new AssemblerInputError("Invalid input.", input);

		const [name, ...args] = input;
		if (!(name instanceof Symbol)) throw new AssemblerInputError("Expected valid name.", input);
		const opcode = map[name.name.camelize()];
		if (!opcode) {
			throw new AssemblerInputError("Unknown method name encountered.", input);
		}

		const text = opcode.UsesText ? args.pop() : "";

		if (this.checkArgumentCount && ~opcode.Arguments && args.length !== opcode.Arguments.length) {
			throw new AssemblerInputError(
				`Expected ${opcode.Arguments} arguments but found ${args.length}.`,
				input
			);
		}

		if (typeof text !== "string") {
			throw new AssemblerInputError("Expected last argument to be a string.", input);
		}

		if (!args.every(arg => typeof arg === "number")) {
			throw new AssemblerInputError("Expected arguments to be of type number.", input);
		}

		if (!args.every(arg => arg >= -1 * 2 ** 15 && arg <= 2 ** 15 - 1)) {
			throw new AssemblerInputError("Arguments must fit into a 16bit signed integer.", input);
		}

		return {
			opcode: opcode.Opcode,
			text: text as string,
			arguments: args
		};
	}
}

export default Assembler;
export { AssemblerInputError };
