import Action from "src/engine/objects/action";
import { Component } from "src/ui";
import Engine from "src/engine/engine";
import TileView from "./tile-view";
import { Tile, Zone } from "src/engine/objects";

abstract class InstructionThing extends Component {
	public zone: Zone = null;
	public action: Action = null;
	public index: number = null;
	public engine: Engine = null;
	public variableMap: any = null;

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
	protected appendTileArgument(arg: number) {
		this.appendChild(
			<span className="argument tile">
				<TileView
					palette={this.engine.palette.original}
					tile={this.engine.assetManager.get(Tile, arg)}
					style={{ zoom: "0.4", transform: "translateY(8.9px)", display: "inline-block" }}
				/>
			</span>
		);
	}
	protected appendLocationArgument(x: number, y: number, z: number = null) {
		this.appendChild(
			<span className="argument location">
				{x.toString()}x{y.toString()}
				{z !== null ? `x${z.toString()}` : ""}
			</span>
		);
	}
}

export default InstructionThing;
