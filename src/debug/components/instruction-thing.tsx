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
		return <span className="command">{name.dasherize()}</span>;
	}

	protected _close(): Element {
		return this._paren("close");
	}

	private _paren(type: "open" | "close") {
		return (
			<span className={type === "close" ? "paren-close" : "paren-open"}>
				{type === "open" ? "(" : ")"}
			</span>
		);
	}

	protected appendNumberArgument(arg: number) {
		this.appendChild(<span className="argument number">{arg.toString()}</span>);
	}
}

export default InstructionThing;
