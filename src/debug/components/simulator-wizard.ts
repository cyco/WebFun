import { Component } from "src/ui";
import { List, Cell } from "src/ui/components";
import { ZoneInspectorCell } from "src/editor/components";
import { Zone, Tile, Hotspot, ZoneType } from "src/engine/objects";
import DataManager from "src/editor/data-manager";
import TileCell from "./tile-cell";

import "./simulator-wizard.scss";

class SimulatorWizard extends Component {
	public static readonly TagName = "wf-debug-simulator-wizard";
	public readonly observedAttribtues: string[] = [];

	private _zoneList: List<Zone>;
	private _requiredItemList: List<Tile>;
	private _additionallyRequiredItemList: List<Tile>;
	private _providedItemList: List<Tile>;
	private _npcList: List<Tile>;

	private _data: DataManager;
	private _state: Storage;

	constructor() {
		super();
		this._state = localStorage.prefixedWith("simulator-wizard");

		this._zoneList = <List<Zone>>document.createElement(List.TagName);
		const cell = <ZoneInspectorCell>document.createElement(ZoneInspectorCell.TagName);
		cell.onclick = (e: Event) => this._onZoneCellClicked(<ZoneInspectorCell>e.currentTarget);
		this._zoneList.searchDelegate = this;
		this._zoneList.cell = cell;
		this._zoneList.state = this._state.prefixedWith("zone-list");

		this._requiredItemList = this._makeTileList("required-items");
		this._additionallyRequiredItemList = this._makeTileList("additionally-required-items");
		this._providedItemList = this._makeTileList("provided-items");
		this._npcList = this._makeTileList("npc");
	}

	private _onZoneCellClicked(cell: ZoneInspectorCell) {
		const selectedCell = this._zoneList.querySelector("[selected]");
		if (selectedCell) selectedCell.removeAttribute("selected");

		let zone: Zone = null;

		if (cell) {
			cell.setAttribute("selected", "");
			zone = cell.data;
		}

		const collectItems = (key: string, zone: any) =>
			zone[key]
				.slice()
				.concat(
					zone.doors
						.map((door: Hotspot) => collectItems(key, this.data.currentData.zones[door.arg]))
						.flatten()
				);

		this._requiredItemList.items = zone ? collectItems("requiredItems", zone).unique() : [];
		this._npcList.items = zone ? collectItems("puzzleNPCs", zone).unique() : [];
		this._providedItemList.items = zone ? collectItems("providedItems", zone).unique() : [];
		this._additionallyRequiredItemList.items = zone ? collectItems("goalItems", zone).unique() : [];
	}

	private _makeTileList(name: string) {
		const list = <List<Tile>>document.createElement(List.TagName);
		list.cell = <TileCell>document.createElement(TileCell.TagName);
		list.cell.onclick = (e: MouseEvent) => this._onTileCellClicked(<TileCell>e.currentTarget);
		list.state = this._state.prefixedWith(name + "-list");
		return list;
	}

	private _onTileCellClicked(cell: TileCell) {
		const list = cell.closest(List.TagName);
		Array.from(list.querySelectorAll("[selected]")).forEach((c: Element) => c.removeAttribute("selected"));
		cell.setAttribute("selected", "");
	}

	connectedCallback() {
		this.appendChild(this._zoneList);
		this.appendChild(this._requiredItemList);
		this.appendChild(this._additionallyRequiredItemList);
		this.appendChild(this._providedItemList);
		this.appendChild(this._npcList);
	}

	disconnectedCallback() {}

	set data(d: DataManager) {
		this._data = d;

		this._assignTileSheet(<ZoneInspectorCell>this._zoneList.cell);
		this._assignTileSheet(<TileCell>this._providedItemList.cell);
		this._assignTileSheet(<TileCell>this._npcList.cell);
		this._assignTileSheet(<TileCell>this._requiredItemList.cell);
		this._assignTileSheet(<TileCell>this._additionallyRequiredItemList.cell);

		this._zoneList.items = d.currentData.zones.filter(
			zone => ![ZoneType.Room, ZoneType.Load, ZoneType.Lose, ZoneType.Win].contains(zone.type)
		);
	}

	private _assignTileSheet(cell: ZoneInspectorCell | TileCell) {
		cell.tileSheet = this._data.tileSheet;
	}

	get data() {
		return this._data;
	}

	prepareListSearch(searchValue: string, list: List<Zone>): RegExp[] {
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], item: Zone, cell: ZoneInspectorCell, list: List<Zone>): boolean {
		const searchableAttributes = [
			item.id,
			item.size.width + "x" + item.size.height,
			item.hasTeleporter ? "Teleporter" : item.type.name,
			item.planet.name
		];

		const string = searchableAttributes.join(" ");
		return searchValue.every(r => r.test(string));
	}

	get chosenSettings() {
		const zoneCell = <Cell<Zone>>this._zoneList.querySelector("[selected]");
		const requiredItemCell = <Cell<Tile>>this._requiredItemList.querySelector("[selected]");
		const providedItemCell = <Cell<Tile>>this._providedItemList.querySelector("[selected]");
		const additionallyRequiredItemCell = <Cell<Tile>>this._additionallyRequiredItemList.querySelector("[selected]");
		const puzzleNPCCell = <Cell<Tile>>this._npcList.querySelector("[selected]");

		return {
			zone: zoneCell ? zoneCell.data : null,
			requiredItem: requiredItemCell ? requiredItemCell.data : null,
			providedItem: providedItemCell ? providedItemCell.data : null,
			additionallyRequiredItem: additionallyRequiredItemCell ? additionallyRequiredItemCell.data : null,
			puzzleNPC: puzzleNPCCell ? puzzleNPCCell.data : null
		};
	}
}

export default SimulatorWizard;
