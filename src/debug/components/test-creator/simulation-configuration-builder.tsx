import "./simulation-configuration-builder.scss";

import { Component } from "src/ui";
import { DiscardingStorage } from "src/util";
import { PopoverTilePicker } from "src/editor/components";
import PopoverZonePicker from "../popover-zone-picker";
import testableZoneFilter from "./testable-zone-filter";
import { Zone, Hotspot } from "src/engine/objects";
import { Configuration } from "src/debug/automation/test";
import adjacentZones from "./adjacent-zones";
import { ColorPalette, GameData } from "src/engine";

class SimulationConfigurationBuilder extends Component {
	public static readonly tagName = "wf-debug-test-creator-simulation-configuration-builder";

	private _gameData: GameData = null;
	private _state: Storage = new DiscardingStorage();
	private _mainPicker = (
		<PopoverZonePicker
			filter={testableZoneFilter}
			onchange={({ detail: { zone } }: CustomEvent) => (this.currentZone = zone)}
		/>
	) as PopoverZonePicker;
	private _zonePickers = (8).times(
		() =>
			(
				<PopoverZonePicker
					filter={({ type, planet }: Zone) =>
						type === Zone.Type.Empty && planet === this.currentZone.planet
					}
					disabled={true}
				/>
			) as PopoverZonePicker
	);
	private _findTile = (<PopoverTilePicker title="Item to find" />) as PopoverTilePicker;
	private _npcTile = (<PopoverTilePicker title="Npc involved in trade" />) as PopoverTilePicker;
	private _requiredTile = (
		<PopoverTilePicker title="Item required to solve puzzle" />
	) as PopoverTilePicker;
	private _required2Tile = (<PopoverTilePicker title="Item required to solve goal" />) as PopoverTilePicker;
	private _inventory: number[] = [];
	private _tags: string[];
	private _description: string;
	private _difficulty: number;
	private _health: number;

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(
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

		this.appendChild(
			<div className="tile-container">
				{this._requiredTile}
				{this._required2Tile}
				{this._findTile}
				{this._npcTile}
			</div>
		);
	}

	protected disconnectedCallback(): void {
		this.textContent = "";
		super.disconnectedCallback();
	}

	public get currentZone(): Zone {
		return this._mainPicker.zone || this._gameData.zones[0];
	}

	public set currentZone(zone: Zone) {
		const connectedZones = this.connectedZones(zone);
		this._mainPicker.zone = zone;
		this._findTile.tiles = zone.providedItems
			.concat(...connectedZones.map(z => z.providedItems))
			.unique();
		this._findTile.tile = this._findTile.tiles.first();
		this._npcTile.tiles = zone.npcs.concat(...connectedZones.map(z => z.npcs)).unique();
		this._npcTile.tile = this._npcTile.tiles.first();

		this._requiredTile.tiles = zone.requiredItems
			.concat(...connectedZones.map(z => z.requiredItems))
			.unique();
		this._requiredTile.tile = this._requiredTile.tiles.first();
		this._required2Tile.tiles = zone.goalItems.concat(...connectedZones.map(z => z.goalItems)).unique();
		this._required2Tile.tile = this._required2Tile.tiles.first();

		const zones = adjacentZones(zone, this._zonePickers.first().zones);
		this._zonePickers.forEach((picker, idx) => (picker.zone = zones[idx]));
	}

	private connectedZones(zone: Zone): Zone[] {
		return zone.doors
			.filter(({ arg }: Hotspot) => arg !== -1)
			.map(({ arg }) => {
				const zone = this._gameData.zones[arg];
				return [zone, ...this.connectedZones(zone)];
			})
			.flatten();
	}

	public set palette(palette: ColorPalette) {
		this._findTile.palette = palette;
		this._npcTile.palette = palette;
		this._requiredTile.palette = palette;
		this._required2Tile.palette = palette;

		this._mainPicker.palette = palette;

		this._zonePickers.forEach(picker => (picker.palette = palette));
	}

	public get palette(): ColorPalette {
		return this._findTile.palette;
	}

	public set gameData(gameData: GameData) {
		this._gameData = gameData;

		this._mainPicker.zones = gameData.zones;
		this._mainPicker.zone = this._mainPicker.filteredZones[0];

		this._zonePickers.forEach(picker => (picker.zones = gameData.zones));

		this.currentZone = this.currentZone;
	}

	public get gameData(): GameData {
		return this._gameData;
	}

	public set configuration(config: Configuration) {
		const data = this._gameData;

		if (config.zone >= 0) {
			this.currentZone = data.zones[config.zone];
			this._findTile.tile = data.tiles[config.findItem];
			this._npcTile.tile = data.tiles[config.npc];
			this._requiredTile.tile = data.tiles[config.requiredItem1];
			this._required2Tile.tile = data.tiles[config.requiredItem2];
		}
		this._inventory = config.inventory;
		this._tags = config.tags;
		this._description = config.description;
		this._difficulty = config.difficulty;
		this._health = config.health;
	}

	public get configuration(): Configuration {
		const zone = this.currentZone.id;
		const requiredItem1 = this._requiredTile.tile ? this._requiredTile.tile.id : null;
		const requiredItem2 = this._required2Tile.tile ? this._required2Tile.tile.id : null;
		const findItem = this._findTile.tile ? this._findTile.tile.id : null;
		const npc = this._npcTile.tile ? this._npcTile.tile.id : null;

		return {
			seed: zone,
			zone,
			findItem,
			npc,
			requiredItem1,
			requiredItem2,
			inventory: this._inventory,
			tags: this._tags,
			description: this._description,
			difficulty: this._difficulty,
			health: this._health
		};
	}

	public set state(s: Storage) {
		this._state = s;
		this._mainPicker.state = s.prefixedWith(`main-zone`);
		this.currentZone = this.currentZone;

		this._zonePickers.forEach((p, idx) => (p.state = s.prefixedWith(`state-${idx}`)));

		this._findTile.state = s.prefixedWith("find-tile");
		this._npcTile.state = s.prefixedWith("npc-tile");
		this._requiredTile.state = s.prefixedWith("required-tile");
		this._required2Tile.state = s.prefixedWith("goal-tile");
	}

	public get state(): Storage {
		return this._state;
	}
}

export default SimulationConfigurationBuilder;
