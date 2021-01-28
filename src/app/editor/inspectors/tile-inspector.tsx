import "./tile-inspector.scss";

import { ceil, floor, sqrt } from "src/std/math";

import AbstractInspector from "./abstract-inspector";
import { ColorPalette } from "src/engine/rendering";
import { FilePicker } from "src/ui";
import { IconButton } from "src/ui/components";
import { MutableTile } from "src/engine/mutable-objects";
import { TileEditor } from "../components";
import TileView from "src/app/webfun/debug/components/tile-view";
import { download, downloadImage, Size } from "src/util";
import ServiceContainer from "../service-container";
import { Resolver, Updater } from "../reference";
import { Tile } from "src/engine/objects";
import BMPWriter from "../bmp-writer";

class TileInspector extends AbstractInspector {
	private _palette: ColorPalette;
	private _requiredAttributes: number = 0;
	private _prohibitedAttributes: number = 0;
	protected _editor: TileEditor = null;
	private di = ServiceContainer.default;
	private updater = this.di.get(Updater);
	private resolver = this.di.get(Resolver);

	constructor(state: Storage) {
		super(state);

		this.window.title = "Tiles";
		this.window.autosaveName = "tile-inspector";
		this.window.style.width = "532px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";
		this.window.addTitlebarButton(
			<IconButton icon="plus" title="Add new tile" onclick={() => this.addTile()} />
		);
		this.window.addTitlebarButton(
			<IconButton
				icon="download"
				title="Download tileset image"
				onclick={() => this.downloadTileset()}
			/>
		);
		this.window.addTitlebarButton(
			<IconButton icon="upload" title="Upload tileset image" onclick={() => this.uploadTileset()} />
		);
	}

	private toggleBitFilter(bit: number, cell: HTMLElement) {
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

	private toggleBit(tile: MutableTile, bit: number, cell: HTMLElement) {
		tile.attributes ^= 1 << bit;
		cell.textContent = tile.attributes & (1 << bit) ? "1" : "0";
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

	protected addTile(): void {
		const tile = new MutableTile();
		tile.id = this.data.currentData.tiles.length;
		tile.imageData = new Uint8Array(MutableTile.WIDTH * MutableTile.HEIGHT);
		tile.attributes = 0;

		this.data.currentData.tiles.push(tile);
		this.build();
		this.window.content.scrollTop = this.window.content.scrollHeight;
	}

	build(): void {
		this._palette = this.data.palette;
		const previousContent = this.window.content.querySelectorAll(TileView.tagName);
		this.window.content.textContent = "";
		previousContent.forEach((c: TileView) => {
			c.onclick = () => void 0;
			c.tile = null;
			c.palette = null;
		});

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

			(Array.from(cells) as HTMLTableHeaderCellElement[])
				.slice(1)
				.forEach(c => (c.textContent = targetValue));
			this.updateFilter();
		};
		headRow.appendChild(tileCell);

		for (let i = 31; i >= 0; i--) {
			const bitCell = document.createElement("th");
			bitCell.title = `Bit ${i}` + (titles[i] ? ": " + titles[i] : "");
			bitCell.onclick = (e: MouseEvent) => this.toggleBitFilter(i, e.currentTarget as HTMLElement);
			headRow.appendChild(bitCell);
		}
		headRow.appendChild(<th></th>);
		head.appendChild(headRow);
		table.appendChild(head);

		const body = document.createElement("tbody");
		this.data.currentData.tiles.forEach(tile => {
			const row = document.createElement("tr");
			row.dataset.attributes = tile.attributes.toString(10);
			const tileCell = document.createElement("td");

			const tilePreview = document.createElement(TileView.tagName) as TileView;
			tilePreview.palette = this._palette;
			tilePreview.tile = tile;
			tilePreview.style.cursor = "pointer";
			tileCell.onclick = () => this.editTile(tile);
			tileCell.appendChild(tilePreview);
			if (tile.name) tileCell.title = tile.name;
			row.appendChild(tileCell);

			for (let i = 31; i >= 0; i--) {
				const bitCell = document.createElement("td");
				bitCell.textContent = `${tile.attributes & (1 << i) ? 1 : 0}`;
				bitCell.title = `Bit ${i}` + (titles[i] ? ": " + titles[i] : "");
				bitCell.onclick = (e: MouseEvent) =>
					this.toggleBit(tile, i, e.currentTarget as HTMLElement);
				row.appendChild(bitCell);
			}
			row.appendChild(
				<td>
					<IconButton
						title="Delete Tile"
						icon="remove"
						onclick={() => this.deleteTile(tile)}></IconButton>
					<IconButton
						title="Download as Image"
						icon="download"
						onclick={() => this.downloadTile(tile)}></IconButton>
				</td>
			);
			body.appendChild(row);
		});
		table.appendChild(body);
		this.window.content.appendChild(table);
		this.window.content.addEventListener(
			"scroll",
			() => this.state.store("scroll", this.window.content.scrollTop),
			{
				passive: true
			}
		);
	}

	private deleteTile(tile: Tile): void {
		const references = this.resolver.find(tile);
		console.log(references);
		if (
			references.length > 1 &&
			!confirm("The tile is still referenced somewhere. Do you really want to delete it?")
		) {
			return;
		}
		this.updater.deleteItem(tile);
		this.build();
	}

	private downloadTile(tile: Tile): void {
		const bmp = new BMPWriter().write(tile.imageData, this._palette, new Size(32, 32));
		download(bmp, `tile_${tile.id}.bmp`);
	}

	show(): void {
		super.show();
		setTimeout(() => (this.window.content.scrollTop = this.state.load("scroll") | 0));
	}

	public editTile(tile: MutableTile): void {
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

	public downloadTileset(): void {
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

	public async uploadTileset(): Promise<void> {
		const [file] = await FilePicker.Pick({ allowedTypes: ["png"] });
		if (!file) return;

		const image = await file.readAsImage();
		const { width, height, data: rawImageData } = image.toImageData();
		const bpr = 4 * width;

		const tilesPerColumn = floor(height / MutableTile.HEIGHT);
		const tilesPerRow = floor(width / MutableTile.WIDTH);

		for (let y = 0; y < tilesPerColumn; y++) {
			for (let x = 0; x < tilesPerRow; x++) {
				let j = 4 * MutableTile.WIDTH * x + MutableTile.HEIGHT * y * bpr;
				const tileIdx = x + y * tilesPerRow;

				if (tileIdx >= this.data.currentData.tiles.length) break;
				const tile = this.data.currentData.tiles[tileIdx];
				const pixels = new Uint8Array(MutableTile.WIDTH * MutableTile.HEIGHT);

				for (let ty = 0; ty < MutableTile.HEIGHT; ty++) {
					for (let tx = 0; tx < MutableTile.WIDTH; tx++) {
						const i = ty * MutableTile.WIDTH + tx;
						const [r, g, b, a] = [
							rawImageData[j + 4 * tx + 0],
							rawImageData[j + 4 * tx + 1],
							rawImageData[j + 4 * tx + 2],
							rawImageData[j + 4 * tx + 3]
						];
						pixels[i] = this.data.palette.findColor(r, g, b, a);
					}

					j += bpr;
				}

				(tile as MutableTile).imageData = pixels;
			}
		}
	}
}

export default TileInspector;
