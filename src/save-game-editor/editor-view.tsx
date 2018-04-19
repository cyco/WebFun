import { Window, List, Segment, SegmentControl } from "src/ui/components";
import { SaveGameReader } from "src/engine/save-game";
import { InputStream } from "src/util";
import DataManager from "src/editor/data-manager";
import { Planet, WorldSize } from "src/engine/types";
import {
	AmmoControl,
	Tile as TileComponent,
	Map,
	InteractiveHealth as Health,
	InventoryRow,
	Inventory
} from "./components";
import { Ammo } from "src/app/ui";
import { Tile, PuzzleType } from "src/engine/objects";
import { Yoda, GameData, ColorPalette } from "src/engine";
import { File } from "src/std.dom";
import { Reader as SaveGameReaderFactory, SaveState } from "src/engine/save-game";
import { Component } from "src/ui";
import { CSSTileSheet } from "src/editor";
import { ImageFactory } from "src/engine/rendering/canvas";

import "./editor-view.scss";

class EditorView extends Component {
	public static TagName: string = "wf-save-game-editor-view";
	private _gameData: GameData;
	private _palette: ColorPalette;
	private _state: SaveState;
	private _tileSheet: CSSTileSheet;
	private _save: Element = <div className="save" />;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._save);
	}

	private _buildTileSheet(data: GameData, palette: ColorPalette) {
		this._tileSheet = new CSSTileSheet(data.tiles.length);
		data.tiles.forEach(t => this._tileSheet.add(t.imageData));
		this._tileSheet.draw(new ImageFactory(palette));
	}

	public presentState(state: SaveState, data: GameData, palette: ColorPalette) {
		this._buildTileSheet(data, palette);
		this._state = state;
		this._gameData = data;
		this._palette = palette;

		const node = this._buildNodes(state);
		this._save = node;

		this.appendChild(node);
	}

	private _showSegment(segment: Segment): void {
		Array.from(this._save.querySelectorAll(".content")).forEach(
			(c: HTMLElement) => (c.style.display = "none")
		);
		const r = this._save.querySelector(".content." + segment.textContent) as HTMLElement;
		r.style.display = "";
	}

	private _buildNodes(state: SaveState) {
		const currentWeapon = this._findWeaponFace(state.currentWeapon);
		const tileSheet = this._tileSheet;

		const puzzle = this._gameData.puzzles[state.goalPuzzle];
		const missionStatement = puzzle.strings[2];
		const tiles = this._gameData.tiles;

		return (
			<div className="save">
				<span className="seed">
					<label>Seed</label>
					<input value={state.seed.toHex(4)} />
				</span>

				<span className="planet">
					<label>Planet</label>
					<input value={state.planet.name} />
				</span>

				<div className="current-weapon">
					<TileComponent tile={currentWeapon} tileSheet={tileSheet} />
					<AmmoControl vertical value={state.currentAmmo} />
				</div>

				<Health health={state.livesLeft * 100 - state.damageTaken} />

				<span className="mission">{missionStatement}</span>

				<SegmentControl onsegmentchange={(segment: Segment) => this._showSegment(segment)}>
					<Segment selected>World</Segment>
					<Segment>Dagobah</Segment>
					<Segment>Inventory</Segment>
				</SegmentControl>

				<Map
					className="content World"
					world={state.world}
					location={!state.onDagobah ? state.positionOnWorld : null}
					tiles={this._gameData.tiles}
					zones={this._gameData.zones}
					palette={this._palette}
					tileSheet={this._tileSheet}
				/>

				<Map
					className="content Dagobah"
					world={state.dagobah}
					location={state.onDagobah ? state.positionOnWorld : null}
					tiles={this._gameData.tiles}
					zones={this._gameData.zones}
					palette={this._palette}
					tileSheet={this._tileSheet}
				/>

				<Inventory
					className="content Inventory"
					tiles={tiles}
					tileSheet={tileSheet}
					items={Array.from(state.inventoryIDs)
						.map(t => tiles[t])
						.concat(null)}
				/>
			</div>
		);
	}

	private _buildTileComponent(tile: Tile): TileComponent {
		return <TileComponent tile={tile} tileSheet={this._tileSheet} /> as TileComponent;
	}

	private _findWeaponFace(id: number): Tile {
		if (!id) return null;

		const character = this._gameData.characters[id];
		if (!character) return null;
		console.assert(character.isWeapon());
		return character.frames[0].extensionRight;
	}

	private _buildAmmoRow(tile: Tile, value: number, total: number) {
		return (
			<div className="ammo">
				{this._buildTileComponent(tile)}
				<AmmoControl vertical value={value} />
			</div>
		);
	}
}

export default EditorView;
