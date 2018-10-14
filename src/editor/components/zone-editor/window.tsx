import { Panel, AbstractPanel, Window as WindowComponent } from "src/ui/components";
import { Zone } from "src/engine/objects";
import ZoneEditor from "src/editor/components/zone-editor/view";
import "./window.scss";
import Sidebar from "./sidebar";
import SidebarLayer from "src/editor/components/zone-editor/sidebar-layer";
import Layer from "src/editor/components/zone-editor/layer";
import SidebarLayersCell, {
	Events as LayerChangeEvents
} from "src/editor/components/zone-editor/sidebar-layers-cell";
import ToolComponent from "./tool";
import ActionComponent from "./action";
import {
	AbstractTool,
	NoTool,
	PaintBucketTool,
	PencilTool,
	RectangleTool,
	TileChangeEvent
} from "src/editor/tools";
import PopoverTilePicker from "src/editor/components/popover-tile-picker";
import DataManager from "src/editor/data-manager";
import AbstractDrawingTool from "src/editor/tools/abstract-drawing-tool";
import { ActionEditor } from "src/editor/components";
import { ActionDescription } from "src/editor/components/zone-editor/action";

class Window extends AbstractPanel {
	public static readonly tagName = "wf-zone-editor-window";
	private _zone: Zone;
	private _editor: ZoneEditor = <ZoneEditor /> as ZoneEditor;
	private _state: Storage;
	private _sidebar: Sidebar = <Sidebar /> as Sidebar;
	private _tilePicker: PopoverTilePicker;
	private _data: DataManager;
	private _tools: AbstractTool[];
	private _actionsWindow: WindowComponent;

	constructor() {
		super();

		this.pinnable = true;
		this._setupSidebar();

		this._editor.tool = this._tools[0];
	}

	private _setupSidebar() {
		this._sidebar.addEventListener(SidebarLayer.Event.DidToggleVisibility, (e: CustomEvent) => {
			const layer = e.detail.layer as Layer;
			this._editor.setLayerVisible(layer, layer.visible);
		});

		const layers = <SidebarLayersCell /> as SidebarLayersCell;
		layers.addEventListener(
			LayerChangeEvents.LayerDidChange,
			(e: CustomEvent) => (this._editor.currentLayer = e.detail.layer)
		);
		this._sidebar.addEntry(layers, "Layers");

		this._tools = [new NoTool(), new PencilTool(), new RectangleTool(), new PaintBucketTool()];
		const toolComponents = this._tools.map(t => this._buildToolItem(t));
		const actionComponents = [
			{
				name: "Edit Scripts",
				icon: "fa-code",
				command: () => this._editActions()
			}
		].map(a => this._buildActionItem(a));

		this._tilePicker = (
			<PopoverTilePicker
				onchange={(e: CustomEvent) => {
					this._tilePickerTileChanged();
					e.stopImmediatePropagation();
					e.preventDefault();
				}}
				tile={null}
			/>
		) as PopoverTilePicker;
		this._sidebar.addEntry(
			<div style={{ display: "flex", alignItems: "center" } as CSSStyleDeclaration}>
				{[this._tilePicker, ...toolComponents, ...actionComponents]}
			</div>,
			"Tools"
		);
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.content.appendChild(this._sidebar);
		this.content.appendChild(this._editor);
	}

	private _tilePickerTileChanged() {
		const tile = this._tilePicker.tile;
		this._tools
			.filter(t => t instanceof AbstractDrawingTool)
			.forEach((t: AbstractDrawingTool) => (t.tile = tile));
	}

	public show() {
		this._state.store("visible", true);
		this.manager.showWindow(this);
	}

	public close() {
		super.close();
		this._state.store("visible", false);
	}

	public canBeReused(): boolean {
		return !this.pinned;
	}

	private _editActions() {
		if (!this._actionsWindow) {
			const window = <Panel style={{ width: "480px", maxHeight: "630px" }} /> as Panel;
			window.content.appendChild(<ActionEditor />);

			this._actionsWindow = window;
		}

		const editor = this._actionsWindow.content.firstElementChild as ActionEditor;
		editor.data = this._data.currentData;
		editor.zone = this.zone;
		this._actionsWindow.title = `Zone ${this.zone.id}: Actions`;
		this.manager.showWindow(this._actionsWindow);
	}

	private _buildToolItem(tool: AbstractTool): ToolComponent {
		const component = <ToolComponent tool={tool} editor={this._editor} /> as ToolComponent;
		tool.addEventListener(AbstractTool.Event.ChangedTiles, (e: TileChangeEvent) =>
			this._editor.redraw(e.affectedPoints)
		);
		return component;
	}

	private _buildActionItem(a: ActionDescription) {
		return <ActionComponent action={a} /> as ActionComponent;
	}

	set state(state) {
		this._state = state;

		this.pinned = state.load("pinned");
		this.autosaveName = state.load("window-name") || state.store("window-name", String.UUID());
		this.onpin = () => this._state.store("pinned", this.pinned);

		this._sidebar.state = state.prefixedWith("sidebar");

		if (state.load("visible")) this.show();
	}

	get state() {
		return this._state;
	}

	set zone(zone: Zone) {
		this.title = `Zone ${zone.id} (${zone.type.name}, ${zone.planet.name})`;
		this.content.style.width = 2 + 160 + zone.size.width * 32 + "px";
		this.content.style.height = 2 + zone.size.height * 32 + "px";

		this._zone = zone;
		this._editor.zone = zone;
	}

	get zone() {
		return this._zone;
	}

	public set data(d) {
		this._data = d;
		this._editor.palette = d.palette;
		this._editor.characters = d.currentData.characters;

		this._tilePicker.palette = this._data.palette;
		this._tilePicker.tileSheet = this._data.tileSheet;
		this._tilePicker.tiles = this._data.currentData.tiles;
	}

	public get data() {
		return this._data;
	}
}

export default Window;
