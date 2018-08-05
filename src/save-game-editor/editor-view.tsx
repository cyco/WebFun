import {
	AmmoControl,
	Tile as TileComponent,
	InteractiveMap as Map,
	InteractiveHealth as Health,
	Inventory
} from "./components";
import { InventoryDelegate } from "./components/inventory";
import { InteractiveMapContextMenuProvider } from "./components/interactive-map";
import { Tile } from "src/engine/objects";
import { GameData, ColorPalette } from "src/engine";
import { SaveState } from "src/engine/save-game";
import { Menu, Component } from "src/ui";
import { CSSTileSheet } from "src/editor";
import { ImageFactory } from "src/engine/rendering/canvas";

import { Yoda as GameTypeYoda } from "src/engine/type";
import WorldItem from "./world-item";
import { World } from "src/engine/save-game";
import { Segment, SegmentControl } from "src/ui/components";
import { Point, identity } from "src/util";
import { ModalPrompt } from "src/ux";

import "./editor-view.scss";

class EditorView extends Component implements InventoryDelegate, InteractiveMapContextMenuProvider {
	public static tagName: string = "wf-save-game-editor-view";
	private _gameData: GameData;
	private _palette: ColorPalette;
	private _state: SaveState;
	private _tileSheet: CSSTileSheet;
	private _save: Element = <div className="save" />;

	protected connectedCallback() {
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
					<input
						value={state.seed.toHex(4)}
						onchange={e => {
							const input = e.target as HTMLInputElement;
							this._state.seed = input.value.parseInt();
							input.value = this._state.seed.toHex(4);
						}}
					/>
				</span>

				<span className="planet">
					<label>Planet</label>
					<input value={state.planet.name} />
				</span>

				<div className="current-weapon">
					<TileComponent tile={currentWeapon} tileSheet={tileSheet} />
					{state.type === GameTypeYoda && (
						<AmmoControl vertical value={state.currentAmmo} />
					)}
				</div>

				<Health
					health={(4 - state.livesLost) * 100 - state.damageTaken}
					onchange={(e: Event) => {
						const health = e.target as Health;
						this._state.livesLost = 3 - health.lives;
						this._state.damageTaken = health.damage;
					}}
				/>

				<span className="mission">{missionStatement}</span>

				<SegmentControl onsegmentchange={(segment: Segment) => this._showSegment(segment)}>
					<Segment selected>World</Segment>
					{state.type === GameTypeYoda && <Segment>Dagobah</Segment>}
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
					locatorTile={state.type.locatorTile}
					reveal={true}
					contextMenuProvider={this}
				/>

				{state.type === GameTypeYoda && (
					<Map
						className="content Dagobah"
						world={state.dagobah}
						location={state.onDagobah ? state.positionOnWorld : null}
						tiles={this._gameData.tiles}
						zones={this._gameData.zones}
						palette={this._palette}
						tileSheet={this._tileSheet}
						locatorTile={state.type.locatorTile}
						reveal={true}
						contextMenuProvider={this}
					/>
				)}

				<Inventory
					className="content Inventory"
					tiles={tiles}
					tileSheet={tileSheet}
					items={Array.from(state.inventoryIDs)
						.map(t => tiles[t])
						.concat(null)}
					delegate={this}
				/>
			</div>
		);
	}

	private _findWeaponFace(id: number): Tile {
		if (!id) return null;

		const character = this._gameData.characters[id];
		if (!character) return null;
		console.assert(character.isWeapon());
		return character.frames[0].extensionRight;
	}

	get saveGame(): SaveState {
		return this._state;
	}

	get data(): GameData {
		return this._gameData;
	}

	public contextMenuForWorldItem(item: WorldItem, _at: Point, _i: World, of: Map): Menu {
		if (item.zoneId === undefined || item.zoneId === -1) return null;

		return new Menu([
			{
				title: "Clear",
				callback: () => {
					item.field_16 = -1;
					item.field_C = -1;
					item.field_Ea = -1;
					item.find_item_id = -1;
					item.npc_id = -1;
					item.required_item_id = -1;
					item.solved_1 = 0;
					item.solved_2 = 0;
					item.solved_3 = 0;
					item.solved_4 = 0;
					item.visited = false;
					item.zoneId = -1;
					item.additionalRequiredItem = -1;

					of.redraw();
				}
			},
			{
				title: "Change Zone",
				callback: async () => {
					const id = await ModalPrompt("New Zone ID", {
						defaultValue: item.zoneId.toHex(2)
					});
					if (id === null) return;

					const newId = id.parseInt();
					if (this._state.currentZoneID === item.zoneId) {
						this._state.currentZoneID = newId;
					}
					item.zoneId = newId;
					of.redraw();
				}
			},
			{
				title: item.visited ? "Mark unvisted" : "Mark visited",
				callback: () => {
					item.visited = !item.visited;
					item.additionalRequiredItem = -1;
					item.field_16 = -1;
					item.field_C = -1;
					item.field_Ea = -1;
					item.find_item_id = -1;
					item.npc_id = -1;
					item.required_item_id = -1;
					item.solved_1 = !item.visited ? 0 : item.solved_1;
					item.solved_2 = !item.visited ? 0 : item.solved_2;
					item.solved_3 = !item.visited ? 0 : item.solved_3;
					item.solved_4 = !item.visited ? 0 : item.solved_4;

					of.redraw();
				}
			}
		]);
	}

	public inventoryDidAddItem(inventory: Inventory): void {
		this._updateInventory(inventory.items);
	}
	public inventoryDidChangeItem(inventory: Inventory): void {
		this._updateInventory(inventory.items);
	}
	public inventoryDidRemoveItem(inventory: Inventory): void {
		this._updateInventory(inventory.items);
	}

	private _updateInventory(items: Tile[]) {
		this._state.inventoryIDs = new Int16Array(items.filter(identity).map(({ id }) => id));
	}
}

export default EditorView;
