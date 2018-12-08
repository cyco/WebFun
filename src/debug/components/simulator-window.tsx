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
	private _zonePickers = (9).times(
		() =>
			(
				<PopoverZonePicker
					filter={({ type, planet }: Zone) =>
						type === ZoneType.Empty && planet === this.currentZone.planet
					}
				/>
			) as PopoverZonePicker
	);
	private _findTile = <PopoverTilePicker /> as PopoverTilePicker;
	private _npcTile = <PopoverTilePicker /> as PopoverTilePicker;
	private _requiredTile = <PopoverTilePicker /> as PopoverTilePicker;
	private _required2Tile = <PopoverTilePicker /> as PopoverTilePicker;

	public constructor() {
		super();

		this.content.style.width = "400px";
		this.content.style.height = "478px";

		this._zonePickers[4].filter = ({ type }: Zone) =>
			type !== ZoneType.Load &&
			type !== ZoneType.Lose &&
			type !== ZoneType.Room &&
			type !== ZoneType.Win &&
			type !== ZoneType.None;
		this._zonePickers[4].onchange = ({ detail: { zone } }: CustomEvent) => (this.currentZone = zone);

		this.content.appendChild(<div className="zone-container">{this._zonePickers}</div>);
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
		return this._zonePickers[4].zone || this.gameController.data.zones[0];
	}

	private set currentZone(s: Zone) {
		const connectedZones = this.connectedZones(s);
		this._zonePickers[4].zone = s;
		this._findTile.tiles = s.providedItems.concat(...connectedZones.map(z => z.providedItems)).unique();
		this._findTile.tile = this._findTile.tiles.first();
		this._npcTile.tiles = s.puzzleNPCs.concat(...connectedZones.map(z => z.puzzleNPCs)).unique();
		this._npcTile.tile = this._npcTile.tiles.first();
		this._requiredTile.tiles = s.requiredItems
			.concat(...connectedZones.map(z => z.requiredItems))
			.unique();
		this._requiredTile.tile = this._requiredTile.tiles.first();
		this._required2Tile.tiles = s.goalItems.concat(...connectedZones.map(z => z.goalItems)).unique();
		this._required2Tile.tile = this._required2Tile.tiles.first();

		srand(s.id);
		this._zonePickers
			.filter((_, idx) => idx !== 4)
			.forEach(p => (p.zone = p.filteredZones.shuffle().first()));
	}

	private connectedZones(main: Zone): Zone[] {
		return main.doors
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

	public set gameController(c) {
		this._gameController = c;

		this._findTile.palette = c.palette;
		this._npcTile.palette = c.palette;
		this._requiredTile.palette = c.palette;
		this._required2Tile.palette = c.palette;

		this._zonePickers.forEach(p => {
			p.palette = c.palette;
			p.zones = c.data.zones;
			p.zone = p.filteredZones[0];
		});

		this.currentZone = this.currentZone;
	}

	public get state() {
		return this._state;
	}

	public set state(s) {
		this._state = s;

		this._zonePickers.forEach((p, idx) => (p.state = s.prefixedWith(`state-${idx}`)));
		this._findTile.state = s.prefixedWith("find-tile");
		this._npcTile.state = s.prefixedWith("npc-tile");
		this._requiredTile.state = s.prefixedWith("required-tile");
		this._required2Tile.state = s.prefixedWith("goal-tile");
	}
}

export default SimulatorWindow;
