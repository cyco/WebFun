import "./tile-picker.scss";

import { Component } from "src/ui";

import TileFilter from "./tile-filter";
import TilePickerCell from "./tile-picker-cell";

import { List } from "src/ui/components";
import { Tile } from "src/engine/objects";
import { ColorPalette } from "src/engine";

export const Events = {
	TileDidChange: "TileDidChange"
};

class TilePicker extends Component {
	public static readonly tagName = "wf-tile-picker";
	public static readonly observedAttributes: string[] = [];
	private _list: List<Tile>;
	private _tiles: Tile[] = null;
	private _tile: Tile = null;

	constructor() {
		super();

		this._list = (
			<List
				searchDelegate={new TileFilter()}
				cell={
					<TilePickerCell
						onclick={({ currentTarget }: MouseEvent) =>
							this._cellClicked(currentTarget as TilePickerCell)
						}
					/>
				}
			/>
		) as List<Tile>;
		this._list.showBar(true);
	}

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(this._list);

		if (this.tile) {
			const cell = this.findCellForTile(this.tile);
			const previousCell = this._list.querySelector(TilePickerCell.tagName + ".active");
			if (previousCell) previousCell.classList.remove("active");
			if (!cell) return;

			this.tile = cell.data;
			cell.classList.add("active");
		}
	}

	private findCellForTile(tile: Tile): TilePickerCell {
		const cells = this._list.querySelectorAll(TilePickerCell.tagName) as NodeListOf<TilePickerCell>;

		for (let i = 0, len = cells.length; i < len; i++) {
			if (cells[i].data === tile) {
				return cells[i];
			}
		}

		return null;
	}

	private _cellClicked(cell: TilePickerCell) {
		const previousCell = this._list.querySelector(TilePickerCell.tagName + ".active");
		if (previousCell) previousCell.classList.remove("active");
		if (!cell) return;

		this.tile = cell.data;
		this.changeTile(
			this.tile,
			this._list.querySelectorAll(TilePickerCell.tagName).indexOf(cell) - 1
		);

		cell.classList.add("active");
	}

	private changeTile(tile: Tile, index: number) {
		this.tile = tile;
		this.dispatchEvent(
			new CustomEvent(Events.TileDidChange, { detail: { tile, index }, bubbles: true })
		);
		this.dispatchEvent(new CustomEvent("change", { detail: { tile, index }, bubbles: true }));
	}

	protected disconnectedCallback(): void {
		this._list.remove();

		super.disconnectedCallback();
	}

	set tiles(s: Tile[]) {
		this._tiles = s;

		const tiles = s.slice();
		tiles.splice(0, 0, null);
		this._list.items = tiles;
	}

	get tiles(): Tile[] {
		return this._tiles;
	}

	set palette(p: ColorPalette) {
		const cell = this._list.cell as TilePickerCell;
		cell.palette = p;
	}

	get palette(): ColorPalette {
		const cell = this._list.cell as TilePickerCell;
		return cell.palette;
	}

	set tile(tile: Tile) {
		this._tile = tile;
	}

	get tile(): Tile {
		return this._tile;
	}

	set state(s: Storage) {
		this._list.state = s.prefixedWith("list");
	}

	get state(): Storage {
		return this._list.state;
	}

	public updateTile(tile: Tile): void {
		const cell = this.findCellForTile(tile);
		if (!cell) return;
		cell.data = tile;
	}
}

export default TilePicker;
