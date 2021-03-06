import { Action } from "src/engine/objects";
import { Component } from "src/ui";
import Engine from "src/engine/engine";
import TileView from "./tile-view";
import { Tile, Zone } from "src/engine/objects";
import { NullIfMissing } from "src/engine/asset-manager";

abstract class InstructionThing extends Component {
	public zone: Zone = null;
	public action: Action = null;
	public index: number = null;
	public engine: Engine = null;
	public variableMap: any = null;

	static get observedAttributes(): string[] {
		return ["current"];
	}

	get current(): boolean {
		return this.hasAttribute("current");
	}

	set current(flag: boolean) {
		if (flag) this.setAttribute("current", "");
		else this.removeAttribute("current");
	}

	abstract get type(): string;

	protected _open(): Element {
		return this._paren("open");
	}

	protected _command(name: string): Element {
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

	protected appendNumberArgument(arg: number): void {
		this.appendChild(<span className="argument number">{arg.toString()}</span>);
	}

	protected appendTileArgument(arg: number): void {
		this.appendChild(
			<span className="argument tile">
				<TileView
					palette={this.engine.palette.original}
					tile={this.engine.assets.get(Tile, arg, NullIfMissing)}
					style={{ zoom: "0.4", transform: "translateY(8.9px)", display: "inline-block" }}
				/>
			</span>
		);
	}

	protected appendLocationArgument(x: number, y: number, z: number = null): void {
		this.appendChild(
			<span className="argument location">
				{x.toString()}x{y.toString()}
				{z !== null ? `x${z.toString()}` : ""}
			</span>
		);
	}
}

export default InstructionThing;
