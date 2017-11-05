import { Point, Rectangle, Size } from "src/util";
import { Tile } from "src/engine/objects";
import { ImageFactory } from "src/engine/rendering/canvas";

declare interface TileSheetEntry {
	className: string;
	rectangle: Rectangle;
}

class TileSheet {
	private static _maxTileSheetIndex = 0;
	private _styleSheet: CSSStyleSheet;

	private _sheetIndex: number = 0;
	private _entries: TileSheetEntry[];
	private _capacity: number;
	private _tileSize: Size;
	private _sheetSize: Size;
	private _data: Uint8Array;
	private _lastClearedIndex: number;
	private _rule: CSSStyleRule;
	private _image: HTMLCanvasElement;

	constructor(capacity: number, tileSize: Size = new Size(Tile.WIDTH, Tile.HEIGHT)) {

		this._tileSize = tileSize;
		this._sheetSize = new Size(tileSize.width * capacity, tileSize.height);
		this._capacity = capacity;

		this._data = new Uint8Array(capacity * tileSize.area);
		this._entries = new Array(capacity).fill(null);
		this._lastClearedIndex = 0;

		this._sheetIndex = TileSheet._maxTileSheetIndex++;
		this._buildStyleSheet();
		this._buildRule();
		this._buildPositionRules(capacity);
		this._buildCanvas();
	}

	private _buildStyleSheet() {
		const styleNode = <HTMLStyleElement>document.createElement("style");
		document.head.appendChild(styleNode);
		this._styleSheet = <CSSStyleSheet>styleNode.sheet;
	}

	private _buildRule() {
		const sheet = this._styleSheet;
		const index = sheet.insertRule("#_{}");
		const rule = <CSSStyleRule>sheet.rules[index];
		rule.selectorText = `.${this.className}`;
		this._rule = rule;
	}

	private _buildPositionRules(count: number): void {
		const sheet = this._styleSheet;
		const baseName = this.className;
		const baseStyle = `display: block; width: ${this._tileSize.width}px; height: ${this._tileSize.height}px`;

		for (let i = 0; i < count; i++) {
			const className = `${baseName}-tile-${i}`;
			const x = i * this._tileSize.width;
			const y = 0;

			sheet.insertRule(`.${className} {
				${baseStyle};
				background-position: ${-x}px ${-y}px;
			}`);
		}
	}

	private _buildCanvas() {
		const canvas = document.createElement("canvas");
		canvas.classList.add("pixelated");
		canvas.width = this._sheetSize.width;
		canvas.height = this._sheetSize.height;
		this._image = canvas;
	}

	add(data: Uint8Array): TileSheetEntry {
		let freeSpace = this._entries.indexOf(null, this._lastClearedIndex);
		if (freeSpace === -1) freeSpace = this._entries.slice(0, this._lastClearedIndex).indexOf(null);
		if (freeSpace === -1) throw new Error("No space to put tile.");
		this._lastClearedIndex = freeSpace + 1;

		const entry = {
			data: data,
			className: `${this.className}-tile-${freeSpace}`,
			rectangle: this.rectangleForEntry(freeSpace)
		};
		this.placeData(data, entry.rectangle);
		this._entries[freeSpace] = entry;

		return entry;
	}

	remove(entry: TileSheetEntry) {
		const index = this._entries.indexOf(entry);
		if (~index) return;
		this.placeData(new Uint8Array(this._tileSize.area), entry.rectangle);
		this._lastClearedIndex = index;
		this._entries[index] = null;
	}

	draw(factory: ImageFactory): void {
		const imageData = factory.createImageData(this._sheetSize.width, this._sheetSize.height, this._data);

		const context = this._image.getContext("2d");
		context.putImageData(imageData, 0, 0);
		this._rule.style.backgroundImage = `url(${this._image.toDataURL()})`;
	}

	private rectangleForEntry(index: number): Rectangle {
		return new Rectangle(new Point(index * this._tileSize.width, 0), this._tileSize);
	}

	private placeData(data: Uint8Array, rectangle: Rectangle) {
		const minX = rectangle.minX;
		const minY = rectangle.minY;

		for (let y = 0; y < rectangle.size.height; y++) {
			let baseIndex = (minY + y) * this._sheetSize.width;
			for (let x = 0; x < rectangle.size.width; x++) {
				this._data[baseIndex + minX + x] = data[x + y * rectangle.size.width];
			}
		}
	}

	private get className() {
		return "wf-tile-sheet-" + this._sheetIndex;
	}

	public cssClassesForTile(id: number) {
		return [this.className, `${this.className}-tile-${id}`];
	}

	get sheetImage(): HTMLCanvasElement {
		return this._image;
	}
}

export default TileSheet;
