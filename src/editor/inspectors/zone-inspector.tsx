import AbstractInspector from "./abstract-inspector";
import { ZoneInspectorCell } from "../components";
import { Zone } from "src/engine/objects";
import { List } from "src/ui/components";
import ZoneEditorController from "../components/zone-editor/window";
import ReferenceResolver from "src/editor/reference-resolver";

class ZoneInspector extends AbstractInspector {
	private _list: List<Zone>;
	private _controllers: ZoneEditorController[] = [];
	private _state: Storage;

	constructor(state: Storage) {
		super(state);

		this._state = state;

		this.window.title = "Zones";
		this.window.autosaveName = "zone-inspector";
		this.window.style.width = "300px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";

		this._list = document.createElement(List.tagName) as List<Zone>;
		this._list.cell = document.createElement(ZoneInspectorCell.tagName) as ZoneInspectorCell;
		this._list.cell.onclick = (e: MouseEvent) =>
			this._onCellClicked(e.currentTarget as ZoneInspectorCell);
		this._list.searchDelegate = this;
		this._list.state = state.prefixedWith("list");
		this._list.addEventListener(ZoneInspectorCell.Events.RevealReferences, (e: CustomEvent) =>
			this._revealReferences(e.detail.zone)
		);
		this.window.content.appendChild(this._list);
	}

	private _onCellClicked(cell: ZoneInspectorCell) {
		let controller = this._controllers.find(c => c.canBeReused());

		if (!controller) {
			controller = document.createElement(
				ZoneEditorController.tagName
			) as ZoneEditorController;
			controller.data = this.data;
			controller.state = this._state.prefixedWith("editor-" + this._controllers.length);
			this._controllers.push(controller);
		}

		controller.zone = cell.data;
		controller.manager = this.windowManager;
		controller.show();
		this._storeZones();
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
		cell.tileSheet = this.data.tileSheet;
		this._list.items = this.data.currentData.zones;

		const zones = (this._state.load("zones") as number[]) || [];
		zones.forEach(id => {
			const controller = document.createElement(
				ZoneEditorController.tagName
			) as ZoneEditorController;
			controller.manager = this.windowManager;
			controller.data = this.data;
			controller.zone = this.data.currentData.zones[id];
			controller.state = this._state.prefixedWith("editor-" + this._controllers.length);
			this._controllers.push(controller);
		});
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
