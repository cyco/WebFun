import { Component } from "src/ui";
import Action from "src/engine/objects/action";
import Zone from "src/engine/objects/zone";
import Engine from "src/engine/engine";

abstract class InstructionThing extends Component {
	public zone: Zone = null;
	public action: Action = null;
	public index: number = null;
	public engine: Engine = null;

	static get observedAttributes() {
		return ["current"];
	}

	get current() {
		return this.hasAttribute("current");
	}

	set current(flag) {
		if (flag) this.setAttribute("current", "");
		else this.removeAttribute("current");
	}

	abstract get type(): string;

	protected _open(): Element {
		const element = document.createElement('span');
		element.innerText = '(';
		element.classList.add('paren-open');
		return element;
	}

	protected _command(name: string){
		const element = document.createElement('span');
		element.innerText = name.dasherize();
		element.classList.add('command');
		return element;
	}

	protected _close(): Element {
		const element = document.createElement('span');
		element.innerText = ')';
		element.classList.add('paren-close');
		return element;
	}
}

export default InstructionThing;
