import AbstractInspector from "./abstract-inspector";
import TileSheet from "../tile-sheet";

class TileInspector extends AbstractInspector {
	private _list: HTMLElement;
	private _tileSheet: TileSheet;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Tiles";
		this.window.autosaveName = "tile-inspector";
		this.window.style.width = "294px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";

		this._list = document.createElement("div");
		this._list.style.height = "300px";
		this._list.style.width = "274px";
		this._list.style.overflow = "auto";
		this._list.classList.add("inset-border-1px");
	}

	build() {
		console.log("tile inspector build");
		this._tileSheet = this.data.tileSheet;
		this.window.content.textContent = "";
		this._list.textContent = "";

		this.data.currentData.tiles.forEach(tile => {
			const cell = document.createElement("div");
			cell.style.display = "inline-block";
			cell.style.width = "34px";
			cell.style.height = "34px";
			cell.classList.add("inset-border-1px");
			cell.classList.add("inset-border-inverted");

			const classes = this._tileSheet.cssClassesForTile(tile.id);
			classes.forEach(c => cell.classList.add(c));
			this._list.appendChild(cell);
		});
		this.window.content.appendChild(this._list);
	}
}

export default TileInspector;
