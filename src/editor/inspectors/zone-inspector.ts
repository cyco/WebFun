import AbstractInspector from "./abstract-inspector";
import { ZoneInspectorCell } from "../components";
import { Zone } from "src/engine/objects";
import { List } from "src/ui/components";

class ZoneInspector extends AbstractInspector {
	private _list: List<Zone>;

	constructor() {
		super();

		this.window.title = "Zones";
		this.window.autosaveName = "zone-inspector";
		this.window.style.width = "300px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";

		this._list = <List<Zone>>document.createElement(List.TagName);
		this._list.cell = <ZoneInspectorCell>document.createElement(ZoneInspectorCell.TagName);

		this.window.content.appendChild(this._list);
	}

	build() {
		this._list.items = this.data.currentData.tiles;
	}
}

export default ZoneInspector;
