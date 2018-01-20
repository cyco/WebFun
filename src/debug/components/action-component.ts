import { Component } from "src/ui";
import "./action-component.scss";
import { Action, Zone } from "src/engine/objects";
import Engine from "src/engine/engine";
import ConditionComponent from "src/debug/components/condition";
import InstructionComponent from "src/debug/components/instruction";
import ConditionChecker from "src/engine/script/condition-checker";
import { ConditionImplementations } from "src/engine/script/conditions";
import {EvaluationMode} from "src/engine/script";

class ActionComponent extends Component {
	public static readonly TagName = "wf-debug-action";
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

		const headline = document.createElement("span");
		headline.classList.add("head");
		const intro = document.createElement("span");
		intro.classList.add("key");
		intro.textContent = `actn ${action.id}`;
		headline.appendChild(intro);
		this.appendChild(headline);

		this.appendChild(document.createTextNode(`(`));
		this._append(`and`, "key");
		this.appendChild(document.createTextNode(`\t`));

		action.conditions.forEach((condition, index) => {
			const component = <ConditionComponent>document.createElement(ConditionComponent.TagName);
			component.action = this._action;
			component.engine = this.engine;
			component.condition = condition;
			if (index !== 0) {
				this.appendChild(document.createTextNode("\n\t\t"));
			}
			this.appendChild(component);
		});
		this._append(")", "paren-close");
		this.appendChild(document.createTextNode("\n"));
		this.appendChild(document.createTextNode(`\t(`));
		this._append(`do`, "key");

		action.instructions.forEach((instruction) => {
			const component = <InstructionComponent>document.createElement(InstructionComponent.TagName);
			component.action = this._action;
			component.engine = this.engine;
			component.instruction = instruction;
			this.appendChild(document.createTextNode("\n\t\t"));
			this.appendChild(component);
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
		Array.from(this.querySelectorAll(ConditionComponent.TagName)).forEach((condition: ConditionComponent) => {
			if (checker.check(condition.condition, EvaluationMode.Walk)) {
				condition.setAttribute("truthy", "");
			} else {
				condition.removeAttribute("truthy");
			}
		});
	}

	protected _append(thing: string|Element|Element[], className: string) {
		const element = document.createElement("span");
		element.classList.add(className);
		if (typeof thing === "string")
			element.innerText = thing;
		else if (thing instanceof Element) {
			element.appendChild(thing);
		} else {
			thing.forEach((t) => element.appendChild(t));
		}
		this.appendChild(element);
		return element;
	}
}

export default ActionComponent;
