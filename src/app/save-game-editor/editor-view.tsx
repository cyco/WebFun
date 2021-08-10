import "./editor-view.scss";

import {
	AmmoControl,
	InteractiveHealth as Health,
	Inventory,
	InteractiveMap as Map
} from "./components";
import { AssetManager, ColorPalette } from "src/engine";
import { Component, Menu } from "src/ui";
import { DiscardingStorage, Point, identity } from "src/util";
import { Segment, SegmentControl } from "src/ui/components";

import { Yoda as VariantYoda } from "src/variant";
import { InteractiveMapContextMenuProvider } from "./components/interactive-map";
import { InventoryDelegate } from "./components/inventory";
import { ModalPrompt } from "src/ux";
import { PopoverCharacterPicker } from "src/app/editor/components";
import { SaveState } from "src/engine/save-game";
import { Char, Puzzle, Tile, Zone } from "src/engine/objects";
import World from "src/engine/world";
import Sector from "src/engine/sector";
import { NullIfMissing } from "src/engine/asset-manager";

class EditorView extends Component implements InventoryDelegate, InteractiveMapContextMenuProvider {
	public static readonly tagName = "wf-save-game-editor-view";
	private _palette: ColorPalette;
	private _state: SaveState;
	private _save: Element = (<div className="save" />);
	private _assets: AssetManager = null;
	public state: Storage = new DiscardingStorage();

	protected connectedCallback(): void {
		super.connectedCallback();
		this.appendChild(this._save);
	}

	public presentState(state: SaveState, assets: AssetManager, palette: ColorPalette): void {
		this._state = state;
		this._assets = assets;
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
		const puzzle = this._assets.get(Puzzle, state.goalPuzzle);
		const missionStatement = puzzle.strings[2];
		const tiles = this._assets.getAll(Tile);

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
						characters={this.assets.getFiltered(Char, c => c.isWeapon())}
						character={this._assets.get(Char, this._state.currentWeapon, NullIfMissing)}
						onchange={(e: CustomEvent) =>
							(this._state.currentWeapon = e.detail.character ? e.detail.character.id : -1)
						}
					/>
					{state.type === VariantYoda && <AmmoControl vertical value={state.currentAmmo} />}
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
					{state.type === VariantYoda && <Segment>Dagobah</Segment>}
					<Segment>Inventory</Segment>
					<Segment>Props</Segment>
				</SegmentControl>

				<Map
					className="content World"
					world={state.world}
					location={!state.onDagobah ? state.positionOnWorld : null}
					tiles={this._assets.getAll(Tile)}
					zones={this._assets.getAll(Zone)}
					palette={this._palette}
					locatorTile={state.type.locatorTile}
					reveal={true}
					contextMenuProvider={this}
				/>

				{state.type === VariantYoda && (
					<Map
						className="content Dagobah"
						world={state.dagobah}
						location={state.onDagobah ? state.positionOnWorld : null}
						tiles={this._assets.getAll(Tile)}
						zones={this._assets.getAll(Zone)}
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
						value={`${this._state.complexity}`}
						onchange={e => (this._state.complexity = +(e.target as HTMLInputElement).value)}
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
			</div>
		);
	}

	get saveGame(): SaveState {
		return this._state;
	}

	get assets(): AssetManager {
		return this._assets;
	}

	public contextMenuForSector(sector: Sector, _at: Point, _i: World, of: Map): Menu {
		if (!sector.zone) {
			return new Menu([
				{
					title: "Place zone",
					callback: async () => {
						const id = await ModalPrompt("New Zone ID");
						if (id === null) return;

						const newId = id.parseInt();
						sector.zone = this._assets.get(Zone, newId, NullIfMissing);
						of.redraw();
					}
				}
			]);
		}

		const promptForId = async function (
			text: string,
			defaultValue: number = null
		): Promise<number> {
			const input = await ModalPrompt(text, {
				defaultValue: defaultValue?.toHex() ?? ""
			});
			if (input === null) return null;

			const id = input.parseInt();
			if (isNaN(id)) return null;

			return id;
		};

		return new Menu([
			{
				title: "Clear",
				callback: () => {
					sector.additionalGainItem = null;
					sector.puzzleIndex = -1;
					sector.isGoal = false;
					sector.findItem = null;
					sector.npc = null;
					sector.requiredItem = null;
					sector.solved1 = false;
					sector.solved2 = false;
					sector.solved3 = false;
					sector.solved4 = false;
					sector.visited = false;
					sector.zone = null;
					sector.additionalRequiredItem = null;

					of.redraw();
				}
			},
			{
				title: "Change Zone",
				callback: async () => {
					const id = await promptForId("New zone id", sector.zone?.id);
					if (id === null) return;
					if (sector.zone?.id === this._state.currentZoneID) {
						this._state.currentZoneID = id;
					}
					sector.zone = this._assets.get(Zone, id, NullIfMissing);
					of.redraw();
				}
			},
			...(sector.zone.providedItems.length
				? [
						{
							title: "Set provided item",
							callback: async () => {
								const id = await promptForId("Provided item id:", sector.findItem?.id);
								if (id === null) return;

								sector.findItem = this._assets.get(Tile, id, NullIfMissing);
							}
						}
				  ]
				: []),
			...(sector.zone.requiredItems.length
				? [
						{
							title: "Set required item",
							callback: async () => {
								const id = await promptForId("Required item id:", sector.requiredItem?.id);
								if (id === null) return;

								sector.requiredItem = this._assets.get(Tile, id, NullIfMissing);
							}
						}
				  ]
				: []),
			{
				title: sector.visited ? "Mark unvisited" : "Mark visited",
				callback: () => {
					sector.visited = !sector.visited;
					sector.additionalRequiredItem = null;
					sector.additionalGainItem = null;
					sector.puzzleIndex = -1;
					sector.isGoal = false;
					sector.findItem = null;
					sector.npc = null;
					sector.requiredItem = null;
					sector.solved1 = !sector.visited ? false : sector.solved1;
					sector.solved2 = !sector.visited ? false : sector.solved2;
					sector.solved3 = !sector.visited ? false : sector.solved3;
					sector.solved4 = !sector.visited ? false : sector.solved4;

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
		this._state.inventoryIDs = items.filter(identity).map(({ id }) => id);
	}
}

export default EditorView;
