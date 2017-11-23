import AST, { s } from "./ast";
import Symbol from "./symbol";
import { Action } from "src/engine/objects";
import { MutableAction } from "src/engine/mutable-objects";
import Condition from "src/engine/objects/condition";
import Instruction from "src/engine/objects/instruction";

import * as ConditionImport from "src/engine/script/conditions";
import * as InstructionImport from "src/engine/script/instructions";
import { AbstractActionItemInit } from "src/engine/objects/abstract-action-item";

class AssemblerInputError extends Error {
	public readonly input: AST;

	constructor(message: string, input: AST) {
		super(message);
		this.input = input;
	}
}

type ASTFunctionDefinition = [Symbol, Symbol, AST, Array<AST>];
type Opcode = {Opcode: number, Arguments: number, UsesText?: boolean, Description: string};
type OpcodeMap = {[_: string]: Opcode};

const Conditions = <OpcodeMap><any>ConditionImport;
const Instructions = <OpcodeMap><any>InstructionImport;

class Assembler {
	public assemble(input: AST): Action {
		const result = new MutableAction();

		let [defaction, name, ...body] = this.validateInputStructure(input);
		if (typeof name === "string") {
			result.name = name;
		} else {
			body = [name, ...body];
		}

		if (body.length === 1) {
			body = <Array<AST>>body.first();
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
		let inputArray = <Array<AST>>input;

		if (!(input instanceof Array))
			throw new AssemblerInputError("Input must be an array.", input);
		if (inputArray[0] !== s`defaction`)
			throw new AssemblerInputError("Input must be an action definition using defaction.", input);

		return <ASTFunctionDefinition>input.slice();
	}

	private parseAnd(body: Array<AST>): [Condition[], Instruction[]] {
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

		const conditions = body.map((input) => this.parseCondition(input));
		return [conditions, instructions];
	}

	private parseInstruction(input: AST): Instruction {
		return this.parseOpcode(input, Instructions, Instruction);
	}

	private parseCondition(input: AST): Condition {
		return this.parseOpcode(input, Conditions, Condition);
	}

	private parseOpcode<T>(input: AST, map: OpcodeMap, itemClass: {new(data: AbstractActionItemInit): T}): T {
		if (!(input instanceof Array)) throw new AssemblerInputError("Invalid input.", input);

		const [name, ...args] = input;
		if (!(name instanceof Symbol)) throw new AssemblerInputError("Expected valid name.", input);
		const opcode = map[name.name.camelize()];
		if (!opcode) {
			throw new AssemblerInputError("Unknown method name encountered.", input);
		}

		const text = opcode.UsesText ? args.pop() : "";

		if (false && ~opcode.Arguments && args.length !== opcode.Arguments) {
			throw new AssemblerInputError(`Expected ${opcode.Arguments} arguments but found ${args.length}.`, input);
		}

		if (!(typeof text === "string")) {
			throw new AssemblerInputError("Expected last argument to be a string.", input);
		}

		if (!args.every(arg => typeof arg === "number")) {
			throw new AssemblerInputError("Expected arguments to be of type number.", input);
		}

		if (!args.every(arg => arg >= -1 * 2 ** 15 && arg <= 2 ** 15 - 1)) {
			throw new AssemblerInputError("Arguments must fit into a 16bit signed integer.", input);
		}

		return new itemClass({
			opcode: <number>opcode.Opcode,
			text: <string>text,
			arguments: <number[]>args
		});
	}
}

export default Assembler;
export { AssemblerInputError };
