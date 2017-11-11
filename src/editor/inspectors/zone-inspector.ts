import AbstractInspector from "./abstract-inspector";
import { ZoneInspectorCell } from "../components";
import { Zone } from "src/engine/objects";
import { List } from "src/ui/components";
import ZoneEditorController from "./zone-editor-controller";

class ZoneInspector extends AbstractInspector {
	private _list: List<Zone>;
	private _controller: ZoneEditorController;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Zones";
		this.window.autosaveName = "zone-inspector";
		this.window.style.width = "300px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";

		this._list = <List<Zone>>document.createElement(List.TagName);
		this._list.cell = <ZoneInspectorCell>document.createElement(ZoneInspectorCell.TagName);
		this._list.cell.onclick = (e: MouseEvent) => this._onCellClicked(<ZoneInspectorCell>e.currentTarget);
		this._list.classList.add("zone-inspector-list");
		this._list.searchDelegate = this;
		this._list.state = state.prefixedWith("list");

		this.window.content.appendChild(this._list);
	}

	private _onCellClicked(cell: ZoneInspectorCell) {
		if (!this._controller) {
			this._controller = new ZoneEditorController(this.data.tileSheet);
			this._controller.show();
		}

		this._controller.zone = cell.data;
	}

	build() {
		console.log("build");
		const cell = <ZoneInspectorCell>this._list.cell;
		cell.tileSheet = this.data.tileSheet;
		this._list.items = this.data.currentData.zones;
	}

	prepareListSearch(searchValue: string, list: List<Zone>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], item: Zone, cell: ZoneInspectorCell, list: List<Zone>): boolean {
		const searchableAttributes = [
			item.id,
			item.size.width,
			item.size.height,
			item.hasTeleporter ? "Teleporter" : item.type.name,
			item.planet.name
		];

		const string = searchableAttributes.join(" ");
		return searchValue.every(r => r.test(string));
	}
}

export default ZoneInspector;
