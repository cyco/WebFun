import { Window } from "src/ui/components";
import { Zone } from "src/engine/objects";
import ZoneEditor from "src/editor/components/zone-editor";
import TileSheet from "src/editor/tile-sheet";

class ZoneEditorController {
	private _window: Window;
	private _zone: Zone;
	private _editor: ZoneEditor;
	private _tileSheet: TileSheet;

	constructor(tileSheet: TileSheet) {
		this._tileSheet = tileSheet;
		this._window = <Window>document.createElement(Window.TagName);
		this._editor = <ZoneEditor>document.createElement(ZoneEditor.TagName);
		this._editor.tileSheet = tileSheet;
		this._window.content.appendChild(this._editor);
	}

	public show() {
		document.body.appendChild(this._window);
	}

	set zone(zone: Zone) {
		this._window.title = `Zone ${zone.id} (${zone.type.name}, ${zone.planet.name})`;
		this._window.content.style.width = 20 + zone.size.width * 32 + "px";
		this._window.content.style.height = 20 + zone.size.height * 32 + "px";

		this._zone = zone;
		this._editor.zone = zone;
	}

	get zone() {
		return this._zone;
	}
}

export default ZoneEditorController;
