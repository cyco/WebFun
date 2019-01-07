import AbstractInspector from "./abstract-inspector";
import { ZoneInspectorCell } from "../components";
import { Zone } from "src/engine/objects";
import { MutableZone } from "src/engine/mutable-objects";
import { List, IconButton, ContextMenu } from "src/ui/components";
import ZoneEditorController from "../components/zone-editor/window";
import ReferenceResolver from "src/editor/reference-resolver";
import { Point, Size } from "src/util";
import { Menu } from "src/ui";
import { ModalPrompt } from "src/ux";

class ZoneInspector extends AbstractInspector {
	private _list: List<Zone>;
	private _controllers: ZoneEditorController[] = [];
	private _state: Storage;

	constructor(state: Storage) {
		super(state);

		this._state = state;

		this.window.title = "Zones";
		this.window.autosaveName = "zone-inspector";
		this.window.style.width = "326px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";
		this.window.addTitlebarButton(
			<IconButton icon="plus" title="Add new zone" onclick={() => this.addZone()} />
		);

		this._list = <List state={state.prefixedWith("list")} /> as List<Zone>;
		this._list.cell = (
			<ZoneInspectorCell
				onclick={(e: MouseEvent) => this._onCellClicked(e.currentTarget as ZoneInspectorCell)}
				searchDelegate={this}
				oncontextmenu={(e: MouseEvent) => this._onCellContextMenu(e)}
			/>
		) as ZoneInspectorCell;

		this._list.addEventListener(ZoneInspectorCell.Events.RevealReferences, (e: CustomEvent) =>
			this._revealReferences(e.detail.zone)
		);
		this._list.addEventListener(ZoneInspectorCell.Events.RemoveZone, (e: CustomEvent) => {
			if (confirm(`Remove zone ${e.detail.zone.id}?`))
				this.data.currentData.zones.splice(this.data.currentData.zones.indexOf(e.detail.zone.id, 1));
			this.build();
		});
		this._list.addEventListener(ZoneInspectorCell.Events.ChangeType, (e: CustomEvent) => {
			console.log("ChangeType", e.detail.zone.type, e.detail.type);
			e.detail.zone.type = e.detail.type;
			this.build();
		});
		this._list.addEventListener(ZoneInspectorCell.Events.ChangePlanet, (e: CustomEvent) => {
			console.log("ChangePlanet", e.detail.zone.planet, e.detail.planet);
			e.detail.zone.planet = e.detail.planet;
			this.build();
		});
		this.window.content.appendChild(this._list);
	}

	private _onCellClicked(cell: ZoneInspectorCell) {
		let controller = this._controllers.find(c => c.canBeReused());

		if (!controller) {
			controller = document.createElement(ZoneEditorController.tagName) as ZoneEditorController;
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
							title: "Reisze…",
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

								const size = new Size(x, y);
								(zone as MutableZone).size = size;
								(zone as MutableZone).tileIDs = new Int16Array(size.area * 3).map(_ => -1);
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
		console.log("references", resolver.findReferencesTo(zone));
	}

	private _storeZones() {
		this._state.store("zones", this._controllers.map(c => c.zone.id));
	}

	build() {
		const cell = this._list.cell as ZoneInspectorCell;
		cell.palette = this.data.palette;
		cell.tiles = this.data.currentData.tiles;
		this._list.items = this.data.currentData.zones;

		const zones = (this._state.load("zones") as number[]) || [];
		zones.forEach(id => {
			const zone = this.data.currentData.zones[id];
			if (!zone) {
				console.warn(`inspector for zone ${id.toHex(4)} could not be restored.`);
				return;
			}

			const controller = document.createElement(ZoneEditorController.tagName) as ZoneEditorController;
			controller.manager = this.windowManager;
			controller.data = this.data;
			controller.zone = this.data.currentData.zones[id];
			controller.state = this._state.prefixedWith("editor-" + this._controllers.length);
			this._controllers.push(controller);
		});
	}

	private addZone() {
		const template = this.data.currentData.zones.last();
		const zone = new MutableZone();
		zone.id = this.data.currentData.zones.length;
		zone.type = template.type;
		zone.size = template.size;
		zone.name = "New Zone";
		zone.planet = template.planet;
		zone.npcs = template.npcs;
		zone.goalItems = template.goalItems;
		zone.requiredItems = template.requiredItems;
		zone.providedItems = template.providedItems;
		zone.puzzleNPCs = template.puzzleNPCs;
		zone.izaxUnknown = template.izaxUnknown;
		zone.izx4Unknown = template.izx4Unknown;
		zone.actions = template.actions;
		zone.hotspots = template.hotspots;

		zone.visited = template.visited;
		zone.solved = template.solved;
		zone.actionsInitialized = template.actionsInitialized;
		zone.counter = template.counter;
		zone.random = template.random;
		zone.sharedCounter = template.sharedCounter;

		zone.tileIDs = template.tileIDs;

		zone.tileStore = this.data.currentData.tiles;
		zone.zoneStore = this.data.currentData.zones;

		this.data.currentData.zones.push(zone);
		this._list.items = this.data.currentData.zones;
		this._list.firstElementChild.lastElementChild.scrollIntoView();
	}

	prepareListSearch(searchValue: string, _: List<Zone>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], item: Zone, _1: ZoneInspectorCell, _2: List<Zone>): boolean {
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
