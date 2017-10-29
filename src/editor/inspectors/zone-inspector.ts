import AbstractInspector from "./abstract-inspector";
import { ZoneEditor, ZoneInspectorCell } from "../components";
import { Zone } from "src/engine/objects";
import { List } from "src/ui/components";

class ZoneInspector extends AbstractInspector {
	private _list: List<Zone>;
	private _editor: ZoneEditor;

	constructor() {
		super();

		this.window.title = "Zones";
		this.window.autosaveName = "zone-inspector";
		this.window.style.width = "300px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";

		this._list = <List<Zone>>document.createElement(List.TagName);
		this._list.cell = <ZoneInspectorCell>document.createElement(ZoneInspectorCell.TagName);

		this._editor = <ZoneEditor>document.createElement(ZoneEditor.TagName);

		this.window.content.appendChild(this._list);
		this.window.content.appendChild(this._editor);
	}

	build() {
		this._list.items = this.data.currentData.zones;
	}
}

export default ZoneInspector;
