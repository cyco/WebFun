import AbstractInspector from "./abstract-inspector";
import CSSTileSheet from "../css-tile-sheet";
import "./tile-inspector.scss";

class TileInspector extends AbstractInspector {
	private _tileSheet: CSSTileSheet;
	private _requiredAttributes: number = 0;
	private _prohibitedAttributes: number = 0;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Tiles";
		this.window.autosaveName = "tile-inspector";
		this.window.style.width = "502px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";
	}

	private toggleBit(bit: number, cell: HTMLElement) {
		if (cell.textContent === "") {
			cell.textContent = "1";
			this._requiredAttributes |= 1 << bit;
			this._prohibitedAttributes &= ~(1 << bit);

			this.updateFilter();
			return;
		}

		if (cell.textContent === "1") {
			cell.textContent = "0";
			this._requiredAttributes &= ~(1 << bit);
			this._prohibitedAttributes |= 1 << bit;

			this.updateFilter();
			return;
		}

		if (cell.textContent === "0") {
			cell.textContent = "";
			this._requiredAttributes &= ~(1 << bit);
			this._prohibitedAttributes &= ~(1 << bit);

			this.updateFilter();
			return;
		}
	}

	private updateFilter() {
		const table = this.window.content.firstElementChild;
		table.remove();
		const rows = Array.from(table.querySelectorAll("tbody > tr")) as HTMLElement[];

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			const rowAttributes = parseInt(row.dataset.attributes);

			const show =
				(rowAttributes & this._requiredAttributes) === this._requiredAttributes &&
				(rowAttributes & this._prohibitedAttributes) === 0;

			row.style.display = show ? "" : "none";
		}
		this.window.content.appendChild(table);
	}

	build() {
		this._tileSheet = this.data.tileSheet;
		this.window.content.textContent = "";

		const titles: { [_: number]: string } = {
			0: "transparent",
			1: "floor",
			2: "object",
			3: "draggable",
			4: "roof",
			5: "locator",
			6: "weapon",
			7: "item",
			8: "character"
		};

		const table = document.createElement("table");
		table.classList.add("tile-inspector-table");
		table.setAttribute("cellspacing", "0");
		table.setAttribute("cellpadding", "0");
		const head = document.createElement("thead");
		const headRow = document.createElement("tr");

		const tileCell = document.createElement("th");
		tileCell.innerHTML = "&nbsp;";
		tileCell.onclick = () => {
			const cells = headRow.querySelectorAll("th");
			const currentValue = cells[1].textContent;
			let targetValue = "";
			if (currentValue === "") {
				targetValue = "1";
				this._requiredAttributes = -1;
				this._prohibitedAttributes = 0;
			} else if (currentValue === "1") {
				targetValue = "0";
				this._requiredAttributes = 0;
				this._prohibitedAttributes = -1;
			} else {
				targetValue = "";
				this._requiredAttributes = 0;
				this._prohibitedAttributes = 0;
			}

			Array.from(cells)
				.slice(1)
				.forEach(c => (c.textContent = targetValue));
			this.updateFilter();
		};
		headRow.appendChild(tileCell);

		for (let i = 31; i >= 0; i--) {
			const bitCell = document.createElement("th");
			bitCell.title = `Bit ${i}` + (titles[i] ? ": " + titles[i] : "");
			bitCell.onclick = (e: MouseEvent) => this.toggleBit(i, e.currentTarget as HTMLElement);
			headRow.appendChild(bitCell);
		}
		head.appendChild(headRow);
		table.appendChild(head);

		const body = document.createElement("tbody");
		this.data.currentData.tiles.forEach(tile => {
			const row = document.createElement("tr");
			row.dataset.attributes = tile.attributes;
			const tileCell = document.createElement("td");

			const tilePreview = document.createElement("div");
			const classes = this._tileSheet.cssClassesForTile(tile.id);
			tilePreview.className = classes.join(" ");
			tileCell.appendChild(tilePreview);
			if (tile.name) tileCell.title = tile.name;
			row.appendChild(tileCell);

			for (let i = 31; i >= 0; i--) {
				const bitCell = document.createElement("td");
				bitCell.textContent = `${tile.attributes & (1 << i) ? 1 : 0}`;
				bitCell.title = `Bit ${i}` + (titles[i] ? ": " + titles[i] : "");
				row.appendChild(bitCell);
			}
			body.appendChild(row);
		});
		table.appendChild(body);
		this.window.content.appendChild(table);
	}
}

export default TileInspector;
