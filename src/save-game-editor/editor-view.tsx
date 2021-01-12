import "./editor-view.scss";

import {
	AmmoControl,
	InteractiveHealth as Health,
	Inventory,
	InteractiveMap as Map
} from "./components";
import { ColorPalette, GameData } from "src/engine";
import { Component, Menu } from "src/ui";
import { DiscardingStorage, Point, identity } from "src/util";
import { Segment, SegmentControl } from "src/ui/components";

import { Yoda as GameTypeYoda } from "src/engine/type";
import { InteractiveMapContextMenuProvider } from "./components/interactive-map";
import { InventoryDelegate } from "./components/inventory";
import { ModalPrompt } from "src/ux";
import { PopoverCharacterPicker } from "src/editor/components";
import { SaveState } from "src/engine/save-game";
import { Tile } from "src/engine/objects";
import World from "src/engine/world";
import Sector from "src/engine/sector";
import { WorldSize } from "src/engine/types";

class EditorView extends Component implements InventoryDelegate, InteractiveMapContextMenuProvider {
	public static readonly tagName = "wf-save-game-editor-view";
	private _gameData: GameData;
	private _palette: ColorPalette;
	private _state: SaveState;
	private _save: Element = (<div className="save" />);
	public state: Storage = new DiscardingStorage();

	protected connectedCallback(): void {
		super.connectedCallback();
		this.appendChild(this._save);
	}

	public presentState(state: SaveState, data: GameData, palette: ColorPalette) {
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
		let r = this._save.querySelector(".content." + segment.textContent) as Segment;
		if (!r) r = this._save.querySelector(".content") as Segment;
		r.style.display = "";
	}

	private _buildNodes(state: SaveState) {
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
					<PopoverCharacterPicker
						palette={this._palette}
						characters={this.data.characters.filter(c => c.isWeapon())}
						character={this.data.characters[this._state.currentWeapon]}
						onchange={(e: CustomEvent) =>
							(this._state.currentWeapon = e.detail.character ? e.detail.character.id : -1)
						}
					/>
					{state.type === GameTypeYoda && <AmmoControl vertical value={state.currentAmmo} />}
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

				<SegmentControl
					onsegmentchange={(segment: Segment) => this._showSegment(segment)}
					state={this.state.prefixedWith("content")}>
					<Segment>World</Segment>
					{state.type === GameTypeYoda && <Segment>Dagobah</Segment>}
					<Segment>Inventory</Segment>
					<Segment>Props</Segment>
				</SegmentControl>

				<Map
					className="content World"
					world={state.world}
					location={!state.onDagobah ? state.positionOnWorld : null}
					tiles={this._gameData.tiles}
					zones={this._gameData.zones}
					palette={this._palette}
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
						locatorTile={state.type.locatorTile}
						reveal={true}
						contextMenuProvider={this}
					/>
				)}

				<Inventory
					className="content Inventory"
					tiles={tiles}
					palette={this._palette}
					items={Array.from(state.inventoryIDs)
						.map(t => tiles[t])
						.concat(null)}
					delegate={this}
				/>

				{this._buildProps()}
			</div>
		);
	}

	private _buildProps() {
		return (
			<div className="content Props">
				<label>
					onDagobah{" "}
					<input
						value={`${this._state.onDagobah}`}
						onchange={e => (this._state.onDagobah = !!+(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					positionOnWorld.x{" "}
					<input
						value={`${this._state.positionOnWorld.x}`}
						onchange={e => (this._state.positionOnWorld.x = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					positionOnWorld.y{" "}
					<input
						value={`${this._state.positionOnWorld.y}`}
						onchange={e => (this._state.positionOnWorld.y = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					currentZoneID{" "}
					<input
						value={`${this._state.currentZoneID}`}
						onchange={e => (this._state.currentZoneID = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					positionOnZone.x{" "}
					<input
						value={`${this._state.positionOnZone.x}`}
						onchange={e => (this._state.positionOnZone.x = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					positionOnZone.y{" "}
					<input
						value={`${this._state.positionOnZone.y}`}
						onchange={e => (this._state.positionOnZone.y = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					currentWeapon{" "}
					<input
						value={`${this._state.currentWeapon}`}
						onchange={e => (this._state.currentWeapon = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					currentAmmo{" "}
					<input
						value={`${this._state.currentAmmo}`}
						onchange={e => (this._state.currentAmmo = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					forceAmmo{" "}
					<input
						value={`${this._state.forceAmmo}`}
						onchange={e => (this._state.forceAmmo = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					blasterAmmo{" "}
					<input
						value={`${this._state.blasterAmmo}`}
						onchange={e => (this._state.blasterAmmo = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					blasterRifleAmmo{" "}
					<input
						value={`${this._state.blasterRifleAmmo}`}
						onchange={e => (this._state.blasterRifleAmmo = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					difficulty{" "}
					<input
						value={`${this._state.difficulty}`}
						onchange={e => (this._state.difficulty = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					timeElapsed{" "}
					<input
						value={`${this._state.timeElapsed}`}
						onchange={e => (this._state.timeElapsed = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					worldSize{" "}
					<input
						value={`${this._state.worldSize}`}
						onchange={e =>
							(this._state.worldSize = WorldSize.fromNumber(+(e.target as HTMLInputElement).value))
						}
					/>
				</label>
				<label>
					unknownCount{" "}
					<input
						value={`${this._state.unknownCount}`}
						onchange={e => (this._state.unknownCount = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					unknownSum{" "}
					<input
						value={`${this._state.unknownSum}`}
						onchange={e => (this._state.unknownSum = +(e.target as HTMLInputElement).value)}
					/>
				</label>
				<label>
					unknownThing{" "}
					<input
						value={`${this._state.unknownThing}`}
						onchange={e => (this._state.unknownThing = +(e.target as HTMLInputElement).value)}
					/>
				</label>
			</div>
		);
	}

	get saveGame(): SaveState {
		return this._state;
	}

	get data(): GameData {
		return this._gameData;
	}

	public contextMenuForSector(item: Sector, _at: Point, _i: World, of: Map): Menu {
		if (!item.zone) return null;

		return new Menu([
			{
				title: "Clear",
				callback: () => {
					item.additionalGainItem = null;
					item.puzzleIndex = -1;
					item.isGoal = -1;
					item.findItem = null;
					item.npc = null;
					item.requiredItem = null;
					item.solved1 = false;
					item.solved2 = false;
					item.solved3 = false;
					item.solved4 = false;
					item.visited = false;
					item.zone = null;
					item.additionalRequiredItem = null;

					of.redraw();
				}
			},
			{
				title: "Change Zone",
				callback: async () => {
					const id = await ModalPrompt("New Zone ID", {
						defaultValue: (item.zone ? item.zone.id : null).toHex(2)
					});
					if (id === null) return;

					const newId = id.parseInt();
					this._state.currentZoneID = newId;
					item.zone = this.data.zones[newId] || null;
					of.redraw();
				}
			},
			{
				title: item.visited ? "Mark unvisted" : "Mark visited",
				callback: () => {
					item.visited = !item.visited;
					item.additionalRequiredItem = null;
					item.additionalGainItem = null;
					item.puzzleIndex = -1;
					item.isGoal = -1;
					item.findItem = null;
					item.npc = null;
					item.requiredItem = null;
					item.solved1 = !item.visited ? false : item.solved1;
					item.solved2 = !item.visited ? false : item.solved2;
					item.solved3 = !item.visited ? false : item.solved3;
					item.solved4 = !item.visited ? false : item.solved4;

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
