import { ConditionsByName as Conditions } from "src/engine/script/conditions";
import InstructionThing from "./instruction-thing";
import Condition from "src/engine/objects/condition";
import Engine from "src/engine/engine";
import BreakpointButton from "./breakpoint-button";
import LocationBreakpoint from "../breakpoint/location-breakpoint";
import BreakpointStore from "../breakpoint-store";

class ConditionComponent extends InstructionThing {
	public static readonly tagName = "wf-debug-condition";
	public engine: Engine = null;
	public breakpointStore: BreakpointStore = null;
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
		const name = Object.keys(Conditions).find(
			key => (Conditions as any)[key].Opcode === this._condition.opcode
		);
		const definition = (Conditions as any)[name];
		const argCount = Math.max(definition.Arguments, 0);
		const usedArguments = this._condition.arguments.slice(0, argCount);

		this.textContent = "";
		this.appendChild(this._open());
		this.appendChild(this._command(name));
		this.appendChild(
			document.createTextNode((usedArguments.length ? " " : "") + `${usedArguments.join(" ")}`)
		);
		this.appendChild(this._close());
		this.appendChild(
			<BreakpointButton
				store={this.breakpointStore}
				breakpoint={
					new LocationBreakpoint(
						this.zone.id,
						this.action.id,
						"c",
						this.action.conditions.indexOf(this.condition)
					)
				}
			/>
		);
	}
}

export default ConditionComponent;
