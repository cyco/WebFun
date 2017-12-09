import { Size } from "src/util";
import { Tile } from "src/engine/objects";
import { ImageFactory } from "src/engine/rendering/canvas";
import TileSheet, { TileSheetEntry } from "src/engine/rendering/canvas-tilesheet/tile-sheet";

export declare interface CSSTileSheetEntry extends TileSheetEntry {
	className: string;
}

class CSSTileSheet extends TileSheet {
	private static _maxTileSheetIndex = 0;
	private _styleSheet: CSSStyleSheet;

	private _sheetIndex: number = 0;
	private _rule: CSSStyleRule;

	constructor(capacity: number, tileSize: Size = new Size(Tile.WIDTH, Tile.HEIGHT)) {
		super(capacity, tileSize);

		this._sheetIndex = CSSTileSheet._maxTileSheetIndex++;
		this._buildStyleSheet();
		this._buildRule();
		this._buildPositionRules(capacity);
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
		const baseStyle = `display: inline-block;
							 width: ${this._tileSize.width}px;
							height: ${this._tileSize.height}px;`;

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

	public add(data: Uint8Array): TileSheetEntry {
		const entry = <CSSTileSheetEntry>super.add(data);
		entry.className = `${this.className}-tile-${this._lastClearedIndex - 1}`;
		return entry;
	}


	public draw(factory: ImageFactory): void {
		super.draw(factory);

		this._rule.style.setProperty("image-rendering", "pixelated");
		this._rule.style.backgroundImage = `url(${this._canvas.toDataURL()})`;
	}

	private get className() {
		return "wf-tile-sheet-" + this._sheetIndex;
	}

	public cssClassesForTile(id: number) {
		return [this.className, `${this.className}-tile-${id}`];
	}
}

export default CSSTileSheet;
