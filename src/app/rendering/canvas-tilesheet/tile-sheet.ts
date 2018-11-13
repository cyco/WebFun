import { Point, Rectangle, Size } from "src/util";
import { Tile } from "src/engine/objects";
import { ImageFactory } from "../canvas";

export declare interface TileSheetEntry {
	rectangle: Rectangle;
	sheet: TileSheet;
}

class TileSheet {
	protected _entries: TileSheetEntry[];
	protected _capacity: number;
	protected _tileSize: Size;
	protected _sheetSize: Size;
	protected _data: Uint8Array;
	protected _lastClearedIndex: number;
	protected _canvas: HTMLCanvasElement;

	constructor(capacity: number, tileSize: Size = new Size(Tile.WIDTH, Tile.HEIGHT)) {
		this._tileSize = tileSize;
		this._sheetSize = new Size(tileSize.width * capacity, tileSize.height);
		this._capacity = capacity;

		this._data = new Uint8Array(capacity * tileSize.area);
		this._entries = new Array(capacity).fill(null);
		this._lastClearedIndex = 0;

		this._buildCanvas();
	}

	private _buildCanvas() {
		const canvas = document.createElement("canvas");
		canvas.classList.add("pixelated");
		canvas.width = this._sheetSize.width;
		canvas.height = this._sheetSize.height;
		this._canvas = canvas;
	}

	public add(data: Uint8Array): TileSheetEntry {
		let freeSpace = this._entries.indexOf(null, this._lastClearedIndex);
		if (freeSpace === -1) freeSpace = this._entries.slice(0, this._lastClearedIndex).indexOf(null);
		if (freeSpace === -1) throw new Error("No space to put tile.");
		this._lastClearedIndex = freeSpace + 1;

		const entry = {
			data: data,
			rectangle: this.rectangleForEntry(freeSpace),
			sheet: this
		};
		this.placeData(data, entry.rectangle);
		this._entries[freeSpace] = entry;

		return entry;
	}

	public remove(entry: TileSheetEntry) {
		const index = this._entries.indexOf(entry);
		if (index === -1) return;
		this.placeData(new Uint8Array(this._tileSize.area), entry.rectangle);
		this._lastClearedIndex = index;
		this._entries[index] = null;
	}

	public draw(factory: ImageFactory): void {
		const imageData = factory.createImageData(this._sheetSize.width, this._sheetSize.height, this._data);

		const context = this._canvas.getContext("2d");
		context.putImageData(imageData, 0, 0);
	}

	public rectangleForEntry(index: number): Rectangle {
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

	get sheetImage(): HTMLCanvasElement {
		return this._canvas;
	}
}

export default TileSheet;
