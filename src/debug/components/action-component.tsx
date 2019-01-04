import { Component } from "src/ui";
import "./action-component.scss";
import { Action, Zone } from "src/engine/objects";
import Engine from "src/engine/engine";
import ConditionComponent from "src/debug/components/condition";
import InstructionComponent from "src/debug/components/instruction";
import ConditionChecker from "src/engine/script/condition-checker";
import { ConditionImplementations } from "src/engine/script/conditions";
import { EvaluationMode } from "src/engine/script";
import BreakpointButton from "./breakpoint-button";
import LocationBreakpoint from "../breakpoint/location-breakpoint";

class ActionComponent extends Component {
	public static readonly tagName = "wf-debug-action";
	public static readonly observedAttributes = ["current"];
	public zone: Zone = null;
	public index: number = null;
	public engine: Engine = null;
	private _action: Action = null;

	get action() {
		return this._action;
	}

	set action(action) {
		this._action = action;

		this.appendChild(
			<span className="head">
				<span className="key">{`actn ${action.id}`}</span>
				<BreakpointButton breakpoint={new LocationBreakpoint(this.zone.id, this.action.id)} />
			</span>
		);

		this.appendChild(document.createTextNode(`(`));
		this._append(`and`, "key");
		this.appendChild(document.createTextNode(`\t`));

		action.conditions.forEach((condition, index) => {
			if (index !== 0) {
				this.appendChild(document.createTextNode("\n\t"));
			}
			this.appendChild(
				<ConditionComponent
					zone={this.zone}
					action={this._action}
					engine={this.engine}
					condition={condition}
				/>
			);
		});
		this._append(")", "paren-close");
		this.appendChild(document.createTextNode("\n"));
		this.appendChild(document.createTextNode(`\t(`));
		this._append(`do`, "key");

		action.instructions.forEach(instruction => {
			this.appendChild(document.createTextNode("\n\t   "));
			this.appendChild(
				<InstructionComponent
					zone={this.zone}
					action={this._action}
					engine={this.engine}
					instruction={instruction}
				/>
			);
		});
		this._append(")", "paren-close");
		this._append(")", "paren-close");
	}

	get current() {
		return this.hasAttribute("current");
	}

	set current(flag) {
		if (flag) this.setAttribute("current", "");
		else this.removeAttribute("current");
	}

	get _storageId() {
		return `debug.action.expanded.${this.zone}.${this.index}`;
	}

	public evaluateConditions() {
		const checker = new ConditionChecker(ConditionImplementations, this.engine);
		Array.from(this.querySelectorAll(ConditionComponent.tagName)).forEach(
			(condition: ConditionComponent) => {
				if (checker.check(condition.condition, EvaluationMode.Walk, this.engine.currentZone)) {
					condition.setAttribute("truthy", "");
				} else {
					condition.removeAttribute("truthy");
				}
			}
		);
	}

	protected _append(thing: string | Element | Element[], className: string) {
		const element = <span className={className} />;
		if (typeof thing === "string") element.innerText = thing;
		else if (thing instanceof Element) {
			element.appendChild(thing);
		} else {
			thing.forEach(t => element.appendChild(t));
		}
		this.appendChild(element);
		return element;
	}
}

export default ActionComponent;
