import { Window } from "src/ui/components";
import { Zone } from "src/engine/objects";
import ZoneEditor from "src/editor/components/zone-editor";
import TileSheet from "src/editor/tile-sheet";

class ZoneEditorController {
	private _window: Window;
	private _zone: Zone;
	private _editor: ZoneEditor;
	private _tileSheet: TileSheet;
	private _state: Storage;

	constructor(tileSheet: TileSheet, state: Storage) {
		this._state = state;
		this._tileSheet = tileSheet;
		this._window = <Window>document.createElement(Window.TagName);
		this._window.pinnable = true;
		this._window.pinned = state.load("pinned");
		this._window.autosaveName = state.load("window-name") || state.store("window-name", String.UUID());
		this._window.onclose = () => this._state.store("visible", false);
		this._window.onpin = () => state.store("pinned", this._window.pinned);
		this._editor = <ZoneEditor>document.createElement(ZoneEditor.TagName);
		this._editor.tileSheet = tileSheet;
		this._window.content.appendChild(this._editor);

		if (this._state.load("visible")) {
			this.show();
		}
	}

	public show() {
		document.body.appendChild(this._window);
		this._state.store("visible", true);
	}

	public canBeReused(): boolean {
		return !this._window.pinned;
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
