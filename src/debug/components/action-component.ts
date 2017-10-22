import { Component } from "src/ui";
import { IconButton } from "src/ui/components";
import { localStorage } from "src/std.dom";
import { LocationBreakpoint } from "../breakpoint";
import "./action-component.scss";
import BreakpointButton from "./breakpoint-button";
import Condition from "./condition";
import Instruction from "./instruction";
import { Action } from "src/engine/objects";
import Zone from "src/engine/objects/zone";

class ActionComponent extends Component {
	public static readonly TagName = "wf-debug-action";
	public static readonly observedAttributes = ["current"];

	private _action: Action = null;
	private zone: Zone = null;
	private index: number = null;
	private _title = document.createElement("span");
	private _conditionContainer = document.createElement("div");
	private _instructionContainer = document.createElement("div");

	constructor() {
		super();

		this._conditionContainer.style.marginBottom = "10px";
	}

	connectedCallback() {
		const container = document.createElement("div");
		container.classList.add("container");

		const breakpointButton = new BreakpointButton();
		breakpointButton.breakpoint = new LocationBreakpoint(this.zone, this._action);

		container.appendChild(breakpointButton);
		container.appendChild(this._title);

		const expandButton = new IconButton("caret-right");
		expandButton.classList.add("expand");
		expandButton.onclick = () => this.expanded = !this.expanded;
		container.appendChild(expandButton);

		this.appendChild(container);
		this.expanded = localStorage.load(this._storageId);
	}

	get action() {
		return this._action;
	}

	set action(action) {
		this._action = action;
		this._title.innerText = `Action ${action.id}`;

		const makeComponent = (ComponentClass: any, container: Element) => (desc: any, index: number) => {
			const component = new ComponentClass(desc);
			component.zone = this.zone;
			component.action = this.index;
			component.index = index;
			container.appendChild(component);
		};

		action.conditions.forEach(makeComponent(Condition, this._conditionContainer));
		action.instructions.forEach(makeComponent(Instruction, this._instructionContainer));
	}

	get current() {
		return this.hasAttribute("current");
	}

	set current(flag) {
		if (flag) this.setAttribute("current", "");
		else this.removeAttribute("current");
	}

	get expanded() {
		return this.classList.contains("expanded");
	}

	set expanded(flag) {
		if (flag) this.classList.add("expanded");
		else this.classList.remove("expanded");

		if (flag) {
			this.appendChild(this._conditionContainer);
			this.appendChild(this._instructionContainer);
		} else {
			this._conditionContainer.remove();
			this._instructionContainer.remove();
		}

		localStorage.store(this._storageId, !!flag);
	}

	get _storageId() {
		return `debug.action.epanded.${this.zone}.${this.index}`;
	}
}

export default ActionComponent;
