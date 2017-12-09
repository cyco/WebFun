import { ConditionsByName as Conditions } from "src/engine/script/conditions";
import InstructionThing from "./instruction-thing";
import Condition from "src/engine/objects/condition";
import Engine from "src/engine/engine";

class ConditionComponent extends InstructionThing {
	public static readonly TagName = "wf-debug-condition";
	public engine: Engine;
	private _condition: Condition;

	get condition() {
		return this._condition;
	}

	set condition(condition) {
		this._condition = condition;
		this._rebuild();
	}

	get type() {
		return "c";
	}

	private _rebuild() {
		const name = Object.keys(Conditions).find(key => (<any>Conditions)[key].Opcode === this._condition.opcode);
		const definition = (<any>Conditions)[name];
		const argCount = Math.max(definition.Arguments, 0);
		const usedArguments = this._condition.arguments.slice(0, argCount);

		this.textContent = "";
		this.appendChild(this._open());
		this.appendChild(this._command(name));
		this.append((usedArguments.length ? " " : "") + `${usedArguments.join(" ")}`);
		this.appendChild(this._close());
	}
}

export default ConditionComponent;
