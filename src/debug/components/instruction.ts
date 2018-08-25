import InstructionThing from "./instruction-thing";
import { Instruction } from "src/engine/objects";
import Engine from "src/engine/engine";
import { InstructionsByName as Instructions } from "src/engine/script/instructions";

class InstructionComponent extends InstructionThing {
	public static readonly tagName = "wf-debug-instruction";
	public engine: Engine;
	private _instruction: Instruction;

	get instruction() {
		return this._instruction;
	}

	set instruction(instruction) {
		this._instruction = instruction;
		this._rebuild();
	}

	get type() {
		return "i";
	}

	private _rebuild() {
		const name = Object.keys(Instructions).find(
			key => (<any>Instructions)[key].Opcode === this._instruction.opcode
		);
		const definition = (<any>Instructions)[name];
		const argCount = Math.max(definition.Arguments, 0);
		const usedArguments = this._instruction.arguments.slice(0, argCount);

		this.textContent = "";
		this.appendChild(this._open());
		this.appendChild(this._command(name));
		this.appendChild(
			document.createTextNode((usedArguments.length ? " " : "") + `${usedArguments.join(" ")}`)
		);
		this.appendChild(this._close());
	}
}

export default InstructionComponent;
