import { ContextMenu, IconButton, List } from "src/ui/components";
import { Point, Size } from "src/util";

import AbstractInspector from "./abstract-inspector";
import { Menu } from "src/ui";
import { ModalPrompt } from "src/ux";
import { Tile, Zone } from "src/engine/objects";
import {
	Resolver as ReferenceResolver,
	Updater as ReferenceUpdater
} from "src/app/editor/reference";
import ZoneEditorController from "../components/zone-editor/window";
import { ZoneInspectorCell } from "../components";
import { min } from "src/std/math";
import ServiceContainer from "../service-container";
import { NullIfMissing } from "src/engine/asset-manager";

class ZoneInspector extends AbstractInspector {
	private _list: List<Zone>;
	private _controllers: ZoneEditorController[] = [];
	private _state: Storage;

	constructor(state: Storage, di: ServiceContainer) {
		super(state, di);

		this._state = state;

		this.window.title = "Zones";
		this.window.autosaveName = "zone-inspector";
		this.window.style.width = "326px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";
		this.window.addTitlebarButton(
			<IconButton icon="plus" title="Add new zone" onclick={() => this.addZone()} />
		);

		this._list = (<List state={state.prefixedWith("list")} searchDelegate={this} />) as List<Zone>;
		this._list.cell = (
			<ZoneInspectorCell
				onclick={(e: MouseEvent) => this._onCellClicked(e.currentTarget as ZoneInspectorCell)}
				oncontextmenu={(e: MouseEvent) => this._onCellContextMenu(e)}
			/>
		) as ZoneInspectorCell;

		this._list.addEventListener(ZoneInspectorCell.Events.RevealReferences, (e: CustomEvent) =>
			this._revealReferences(e.detail.zone)
		);
		this._list.addEventListener(ZoneInspectorCell.Events.RemoveZone, (e: CustomEvent) => {
			const zone = e.detail.zone;
			const resolver = new ReferenceResolver(this.data.currentData);
			const references = resolver.find(zone).filter(i => i.via[0] !== "id");
			console.log(references);
			if (
				confirm(
					`Remove zone ${e.detail.zone.id}?` +
						(references.length ? `\nIt is still used in ${references.length} places` : "")
				)
			) {
				const updater = new ReferenceUpdater(this.data.currentData);
				updater.deleteItem(e.detail.zone);
			}
			this.build();
		});
		this._list.addEventListener(ZoneInspectorCell.Events.ChangeType, (e: CustomEvent) => {
			e.detail.zone.type = e.detail.type;
			this.build();
		});
		this._list.addEventListener(ZoneInspectorCell.Events.ChangePlanet, (e: CustomEvent) => {
			e.detail.zone.planet = e.detail.planet;
			this.build();
		});
		this.window.content.appendChild(this._list);
	}

	private _onCellClicked(cell: ZoneInspectorCell) {
		let controller = this._controllers.find(c => c.canBeReused());

		if (!controller) {
			controller = document.createElement(ZoneEditorController.tagName) as ZoneEditorController;
			controller.di = this.di;
			controller.data = this.data;
			controller.state = this._state.prefixedWith("editor-" + this._controllers.length);
			this._controllers.push(controller);
		}

		controller.zone = cell.data;
		controller.manager = this.windowManager;
		controller.show();
		this._storeZones();
	}

	private _onCellContextMenu(e: MouseEvent) {
		const cell = e.currentTarget as ZoneInspectorCell;
		const zone = cell.data;

		const contextMenu = (
			<ContextMenu
				menu={
					new Menu([
						{
							title: "Resize…",
							callback: async () => {
								const value = await ModalPrompt("", {
									defaultValue: `${zone.size.width}x${zone.size.height}`
								});
								if (!value) return;
								const [xstr, ystr] = value.split("x");
								if (!xstr || !ystr) return;
								const x = xstr.parseInt();
								const y = ystr.parseInt();
								if (isNaN(x) || isNaN(y)) return;

								const previousTiles = zone.tileIDs;
								const previousSize = zone.size;

								const size = new Size(x, y);
								(zone as Zone).size = size;
								(zone as Zone).tileIDs = new Int16Array(size.area * 3).map(_ => -1);

								for (let y = 0; y < min(previousSize.height, size.height); y++) {
									for (let x = 0; x < min(previousSize.width, size.width); x++) {
										for (let z = 0; z < 3; z++) {
											const idx = 3 * y * previousSize.width + 3 * x + z;
											const t = this.data.currentData.get(Tile, previousTiles[idx], NullIfMissing);
											zone.setTile(t, x, y, z);
										}
									}
								}
							}
						}
					])
				}
			/>
		) as ContextMenu;
		contextMenu.show(new Point(e.clientX, e.clientY));

		e.preventDefault();
		e.stopPropagation();
	}

	private _revealReferences(zone: Zone) {
		const resolver = new ReferenceResolver(this.data.currentData);
		console.log("references", resolver.find(zone));
	}

	private _storeZones() {
		this._state.store(
			"zones",
			this._controllers.map(c => c.zone.id)
		);
	}

	build(): void {
		const cell = this._list.cell as ZoneInspectorCell;
		cell.palette = this.data.palette;
		cell.tiles = this.data.currentData.getAll(Tile);
		this._list.items = this.data.currentData.getAll(Zone);

		const zones = (this._state.load("zones") as number[]) || [];
		zones.forEach(id => {
			const zone = this.data.currentData.get(Zone, id, NullIfMissing);
			if (!zone) {
				console.warn(`inspector for zone ${id} could not be restored.`);
				return;
			}

			const controller = document.createElement(
				ZoneEditorController.tagName
			) as ZoneEditorController;
			controller.di = this.di;
			controller.manager = this.windowManager;
			controller.data = this.data;
			controller.zone = this.data.currentData.get(Zone, id, NullIfMissing);
			controller.state = this._state.prefixedWith("editor-" + this._controllers.length);
			this._controllers.push(controller);
		});
	}

	private addZone() {
		const template = this.data.currentData.getAll(Zone).last();
		const zone = new Zone(
			this.data.currentData.getAll(Zone).length,
			template,
			this.data.currentData
		);
		zone.id = this.data.currentData.getAll(Zone).length;
		zone.type = template.type;
		zone.size = template.size;
		zone.name = "New Zone";
		zone.planet = template.planet;
		zone.monsters = template.monsters;
		zone.goalItems = template.goalItems;
		zone.requiredItems = template.requiredItems;
		zone.providedItems = template.providedItems;
		zone.npcs = template.npcs;
		zone.izaxUnknown = template.izaxUnknown;
		zone.izx4Unknown = template.izx4Unknown;
		zone.actions = template.actions;
		zone.hotspots = template.hotspots;

		zone.visited = template.visited;
		zone.actionsInitialized = template.actionsInitialized;
		zone.counter = template.counter;
		zone.random = template.random;
		zone.sectorCounter = template.sectorCounter;

		zone.tileIDs = template.tileIDs;

		this.data.currentData.getAll(Zone).push(zone);
		this._list.items = this.data.currentData.getAll(Zone);
		this._list.firstElementChild.lastElementChild.scrollIntoView();
	}

	prepareListSearch(searchValue: string, _: List<Zone>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(
		searchValue: RegExp[],
		item: Zone,
		_1: ZoneInspectorCell,
		_2: List<Zone>
	): boolean {
		const searchableAttributes = [
			item.id,
			item.size.width + "x" + item.size.height,
			item.hasTeleporter ? "Teleporter" : item.type.name,
			item.planet.name
		];

		const string = searchableAttributes.join(" ");
		return searchValue.every(r => r.test(string));
	}
}

export default ZoneInspector;
