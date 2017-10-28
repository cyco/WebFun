import AbstractInspector from "./abstract-inspector";
import { TileInspectorCell } from "../components";
import { Tile } from "src/engine/objects";
import { List } from "src/ui/components";

class TileInspector extends AbstractInspector {
	private _list: List<Tile>;

	constructor() {
		super();

		this.window.title = "Tiles";
		this.window.autosaveName = "tile-inspector";
		this.window.style.width = "300px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";

		this._list = <List<Tile>>document.createElement(List.TagName);
		this._list.cell = <TileInspectorCell>document.createElement(TileInspectorCell.TagName);

		this.window.content.appendChild(this._list);
	}

	build() {
		this._list.items = this.data.currentData.tiles;
	}
}

export default TileInspector;
