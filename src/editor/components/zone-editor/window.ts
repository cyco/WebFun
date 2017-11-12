import { Window as WindowComponent } from "src/ui/components";
import { Zone } from "src/engine/objects";
import ZoneEditor from "src/editor/components/zone-editor/view";
import TileSheet from "src/editor/tile-sheet";
import { WindowManager } from "src/ui";
import "./window.scss";
import Sidebar from "./sidebar";
import SidebarLayer from "src/editor/components/zone-editor/sidebar-layer";
import Layer from "src/editor/components/zone-editor/layer";

class Window extends WindowComponent {
	public static readonly TagName = "wf-zone-editor-window";
	private _zone: Zone;
	private _editor: ZoneEditor;
	private _tileSheet: TileSheet;
	private _state: Storage;
	private _sidebar: Sidebar;

	constructor() {
		super();

		this.pinnable = true;

		this._sidebar = <Sidebar>document.createElement(Sidebar.TagName);
		this._sidebar.addEventListener(SidebarLayer.Event.DidToggleVisibility, (e: CustomEvent) => {
			const layer = <Layer>e.detail.layer;
			this._editor.setLayerVisible(layer.layer, layer.visible);
		});
		this._editor = <ZoneEditor>document.createElement(ZoneEditor.TagName);
	}

	connectedCallback() {
		super.connectedCallback();

		this.content.appendChild(this._sidebar);
		this.content.appendChild(this._editor);
	}

	public show() {
		this._state.store("visible", true);
		WindowManager.defaultManager.showWindow(this);
	}

	public close() {
		super.close();
		this._state.store("visible", false);
	}

	public canBeReused(): boolean {
		return !this.pinned;
	}

	set state(state) {
		this._state = state;

		this.pinned = state.load("pinned");
		this.autosaveName = state.load("window-name") || state.store("window-name", String.UUID());
		this.onpin = () => this._state.store("pinned", this.pinned);

		this._sidebar.state = state.prefixedWith("sidebar");

		if (state.load("visible")) {
			this.show();
		}
	}

	get state() {
		return this._state;
	}

	set tileSheet(sheet) {
		this._tileSheet = sheet;
		this._editor.tileSheet = sheet;
	}

	get tileSheet() {
		return this._tileSheet;
	}

	set zone(zone: Zone) {
		this.title = `Zone ${zone.id} (${zone.type.name}, ${zone.planet.name})`;
		this.content.style.width = 2 + 170 + 20 + zone.size.width * 32 + "px";
		this.content.style.height = 2 + 20 + zone.size.height * 32 + "px";

		this._zone = zone;
		this._editor.zone = zone;
	}

	get zone() {
		return this._zone;
	}
}

export default Window;
