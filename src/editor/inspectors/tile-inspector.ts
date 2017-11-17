import AbstractInspector from "./abstract-inspector";
import TileSheet from "../tile-sheet";
import "./tile-inspector.scss";

class TileInspector extends AbstractInspector {
	private _tileSheet: TileSheet;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Tiles";
		this.window.autosaveName = "tile-inspector";
		this.window.style.width = "502px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";
	}

	build() {
		this._tileSheet = this.data.tileSheet;
		this.window.content.textContent = "";

		const titles: {[_: number]: string} = {
			0: "transparent"
		};

		const table = document.createElement("table");
		table.classList.add("tile-inspector-table");
		table.setAttribute("cellspacing", "0");
		table.setAttribute("cellpadding", "0");
		const head = document.createElement("thead");
		const headRow = document.createElement("tr");

		const tileCell = document.createElement("th");
		headRow.appendChild(tileCell);

		for (let i = 31; i >= 0; i--) {
			const bitCell = document.createElement("th");
			bitCell.title = `Bit ${i}` + (titles[i] ? (": " + titles[i]) : "");
			headRow.appendChild(bitCell);
		}
		head.appendChild(headRow);
		table.appendChild(head);

		const body = document.createElement("tbody");
		this.data.currentData.tiles.forEach(tile => {
			const row = document.createElement("tr");
			const tileCell = document.createElement("td");

			const tilePreview = document.createElement("div");
			const classes = this._tileSheet.cssClassesForTile(tile.id);
			tilePreview.className = classes.join(" ");
			tileCell.appendChild(tilePreview);
			if (tile.name) tileCell.title = tile.name;
			row.appendChild(tileCell);

			for (let i = 31; i >= 0; i--) {
				const bitCell = document.createElement("td");
				bitCell.textContent = `${(tile.attributes & (1 << i)) ? 1 : 0}`;
				bitCell.title = `Bit ${i}` + (titles[i] ? (": " + titles[i]) : "");
				row.appendChild(bitCell);
			}
			body.appendChild(row);
		});
		table.appendChild(body);
		this.window.content.appendChild(table);
	}
}

export default TileInspector;
