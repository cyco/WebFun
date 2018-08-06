import AbstractInspector from "./abstract-inspector";
import CSSTileSheet from "../css-tile-sheet";
import { IconButton } from "src/ui/components";
import { MutableTile } from "src/engine/mutable-objects";
import { TileEditor } from "../components";
import { sqrt, ceil } from "src/std.math";
import { downloadImage } from "src/util";
import "./tile-inspector.scss";

class TileInspector extends AbstractInspector {
	private _tileSheet: CSSTileSheet;
	private _requiredAttributes: number = 0;
	private _prohibitedAttributes: number = 0;
	protected _editor: TileEditor = null;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Tiles";
		this.window.autosaveName = "tile-inspector";
		this.window.style.width = "502px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";
		this.window.addTitlebarButton(<IconButton icon="plus" onclick={() => this.addTile()} />);
		this.window.addTitlebarButton(
			<IconButton icon="download" onclick={() => this.downloadTileset()} />
		);
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

	protected addTile() {
		const tile = new MutableTile();
		tile.id = this.data.currentData.tiles.length;
		tile.imageData = new Uint8Array(MutableTile.WIDTH * MutableTile.HEIGHT);
		tile.attributes = 0;

		this.data.currentData.tiles.push(tile);
		this.build();
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
			tilePreview.style.cursor = "pointer";
			tileCell.onclick = () => this.editTile(tile);
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

	public editTile(tile: MutableTile) {
		if (this._editor) {
			this._editor.remove();
		}

		const editor = (
			<TileEditor
				palette={this.data.palette}
				pixels={tile.imageData}
				tile={tile}
				autosaveName="tile-editor"
			/>
		) as TileEditor;

		this.windowManager.showWindow(editor);
		this._editor = editor;
	}

	public downloadTileset() {
		const size = ceil(sqrt(this.data.currentData.tiles.length));

		const TileWidth = MutableTile.WIDTH;
		const TileHeight = MutableTile.HEIGHT;
		const imageData = new ImageData(size * TileWidth, size * TileHeight);
		const rawImageData = imageData.data;
		const palette = this.data.palette;

		const bpr = 4 * size * TileWidth;
		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				const tile = this.data.currentData.tiles[x + y * size];
				if (!tile) break;

				const pixels = tile.imageData;
				const sy = y * TileHeight;
				const sx = x * TileWidth;
				let j = sy * bpr + sx * 4;

				for (let ty = 0; ty < TileHeight; ty++) {
					for (let tx = 0; tx < TileWidth; tx++) {
						const i = ty * TileWidth + tx;
						const paletteIndex = pixels[i] * 4;
						if (paletteIndex === 0) continue;

						rawImageData[j + 4 * tx + 0] = palette[paletteIndex + 2];
						rawImageData[j + 4 * tx + 1] = palette[paletteIndex + 1];
						rawImageData[j + 4 * tx + 2] = palette[paletteIndex + 0];
						rawImageData[j + 4 * tx + 3] = paletteIndex === 0 ? 0x00 : 0xff;
					}

					j += bpr;
				}
			}
		}

		downloadImage(imageData, `${this.data.type.name} tileset.png`);
	}
}

export default TileInspector;
