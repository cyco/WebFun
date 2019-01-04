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
		return this._paren("open");
	}

	protected _command(name: string) {
		const element = document.createElement("span");
		element.innerText = name.dasherize();
		element.classList.add("command");
		return element;
	}

	protected _close(): Element {
		return this._paren("close");
	}

	private _paren(type: "open" | "close") {
		const element = document.createElement("span");
		element.innerText = type === "open" ? "(" : ")";
		element.classList.add(type === "close" ? "paren-close" : "paren-open");
		return element;
	}
}

export default InstructionThing;
