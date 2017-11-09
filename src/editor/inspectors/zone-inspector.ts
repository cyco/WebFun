import AbstractInspector from "./abstract-inspector";
import { ZoneEditor, ZoneInspectorCell } from "../components";
import { Zone } from "src/engine/objects";
import { List } from "src/ui/components";

class ZoneInspector extends AbstractInspector {
	private _list: List<Zone>;
	private _editor: ZoneEditor;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Zones";
		this.window.autosaveName = "zone-inspector";
		this.window.style.width = "300px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";

		this._list = <List<Zone>>document.createElement(List.TagName);
		this._list.cell = <ZoneInspectorCell>document.createElement(ZoneInspectorCell.TagName);
		this._list.searchDelegate = this;
		this._list.state = state.prefixedWith("list");

		this._editor = <ZoneEditor>document.createElement(ZoneEditor.TagName);

		this.window.content.appendChild(this._list);
		this.window.content.appendChild(this._editor);
	}

	build() {
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
			item.type.name,
			item.planet.name
		];
		const string = searchableAttributes.join(" ");
		return searchValue.every(r => r.test(string));
	}
}

export default ZoneInspector;
