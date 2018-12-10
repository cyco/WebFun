import { AbstractWindow, Button } from "src/ui/components";
import "./simulator-window.scss";
import { GameController } from "src/app";
import { DiscardingStorage } from "src/util";
import PopoverZonePicker from "./popover-zone-picker";
import { PopoverTilePicker } from "src/editor/components";
import { Zone, ZoneType, Hotspot } from "src/engine/objects";
import { srand } from "src/util";

class SimulatorWindow extends AbstractWindow {
	public static readonly tagName = "wf-debug-simulator-window";
	title = "Simulate Zone";
	autosaveName = "simulator";
	private _gameController: GameController;
	private _state: Storage = new DiscardingStorage();
	private _mainPicker = (
		<PopoverZonePicker
			filter={({ type }: Zone) =>
				type !== ZoneType.Load &&
				type !== ZoneType.Lose &&
				type !== ZoneType.Room &&
				type !== ZoneType.Win &&
				type !== ZoneType.None
			}
			onchange={({ detail: { zone } }: CustomEvent) => (this.currentZone = zone)}
		/>
	) as PopoverZonePicker;
	private _zonePickers = (8).times(
		() =>
			(
				<PopoverZonePicker
					filter={({ type, planet }: Zone) =>
						type === ZoneType.Empty && planet === this.currentZone.planet
					}
				/>
			) as PopoverZonePicker
	);
	private _findTile = <PopoverTilePicker title="Item to find" /> as PopoverTilePicker;
	private _npcTile = <PopoverTilePicker title="Npc involved in trade" /> as PopoverTilePicker;
	private _requiredTile = <PopoverTilePicker title="Item required to solve puzzle" /> as PopoverTilePicker;
	private _required2Tile = <PopoverTilePicker title="Item required to solve goal" /> as PopoverTilePicker;

	public constructor() {
		super();

		this.content.style.width = "400px";
		this.content.style.height = "478px";

		this.content.appendChild(
			<div className="zone-container">
				{this._zonePickers[0]}
				{this._zonePickers[1]}
				{this._zonePickers[2]}
				{this._zonePickers[3]}
				{this._mainPicker}
				{this._zonePickers[4]}
				{this._zonePickers[5]}
				{this._zonePickers[6]}
				{this._zonePickers[7]}
			</div>
		);
		this.content.appendChild(
			<div className="tile-container">
				{this._requiredTile}
				{this._required2Tile}
				{this._findTile}
				{this._npcTile}
			</div>
		);

		this.content.appendChild(
			<div className="button-container">
				<Button label="Cancel" onclick={() => this.close()} />
				<Button label="Simulate" />
			</div>
		);
	}

	private get currentZone() {
		return this._mainPicker.zone || this.gameController.data.zones[0];
	}

	private set currentZone(zone: Zone) {
		const connectedZones = this.connectedZones(zone);
		this._mainPicker.zone = zone;
		this._findTile.tiles = zone.providedItems
			.concat(...connectedZones.map(z => z.providedItems))
			.unique();
		this._findTile.tile = this._findTile.tiles.first();
		this._npcTile.tiles = zone.puzzleNPCs.concat(...connectedZones.map(z => z.puzzleNPCs)).unique();
		this._npcTile.tile = this._npcTile.tiles.first();

		this._requiredTile.tiles = zone.requiredItems
			.concat(...connectedZones.map(z => z.requiredItems))
			.unique();
		this._requiredTile.tile = this._requiredTile.tiles.first();
		this._required2Tile.tiles = zone.goalItems.concat(...connectedZones.map(z => z.goalItems)).unique();
		this._required2Tile.tile = this._required2Tile.tiles.first();

		srand(zone.id);

		this._zonePickers
			.filter(picker => !picker.filteredZones.contains(picker.zone))
			.forEach(picker => (picker.zone = picker.filteredZones.shuffle().first()));
	}

	private connectedZones(zone: Zone): Zone[] {
		return zone.doors
			.filter(({ arg }: Hotspot) => arg !== -1)
			.map(({ arg }) => {
				const zone = this._gameController.data.zones[arg];
				return [zone, ...this.connectedZones(zone)];
			})
			.flatten();
	}

	public get gameController() {
		return this._gameController;
	}

	public set gameController(controller) {
		this._gameController = controller;

		this._findTile.palette = controller.palette;
		this._npcTile.palette = controller.palette;
		this._requiredTile.palette = controller.palette;
		this._required2Tile.palette = controller.palette;

		this._mainPicker.palette = controller.palette;
		this._mainPicker.zones = controller.data.zones;
		this._mainPicker.zone = this._mainPicker.filteredZones[0];

		this._zonePickers.forEach(picker => {
			picker.palette = controller.palette;
			picker.zones = controller.data.zones;
			picker.zone = picker.filteredZones[0];
		});

		this.currentZone = this.currentZone;
	}

	public get state() {
		return this._state;
	}

	public set state(s) {
		this._state = s;

		this._mainPicker.state = s.prefixedWith(`main-zone`);
		this.currentZone = this.currentZone;

		this._zonePickers.forEach((p, idx) => (p.state = s.prefixedWith(`state-${idx}`)));

		this._findTile.state = s.prefixedWith("find-tile");
		this._npcTile.state = s.prefixedWith("npc-tile");
		this._requiredTile.state = s.prefixedWith("required-tile");
		this._required2Tile.state = s.prefixedWith("goal-tile");
	}
}

export default SimulatorWindow;
