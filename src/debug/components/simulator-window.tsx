import { AbstractWindow, Button } from "src/ui/components";
import "./simulator-window.scss";
import { GameController } from "src/app";
import { DiscardingStorage } from "src/util";
import PopoverZonePicker from "./popover-zone-picker";
import { PopoverTilePicker } from "src/editor/components";
import { Zone, ZoneType } from "src/engine/objects";

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
		this._zonePickers[4].zone = s;
		this._findTile.tiles = s.providedItems;
		this._npcTile.tiles = s.puzzleNPCs;
		this._requiredTile.tiles = s.requiredItems;
		this._required2Tile.tiles = s.goalItems;
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

		this._findTile.state = s.prefixedWith("find-tile");
		this._npcTile.state = s.prefixedWith("npc-tile");
		this._requiredTile.state = s.prefixedWith("required-tile");
		this._required2Tile.state = s.prefixedWith("goal-tile");
		this._zonePickers.forEach((p, idx) => (p.state = s.prefixedWith(`state-${idx}`)));
	}
}

export default SimulatorWindow;
