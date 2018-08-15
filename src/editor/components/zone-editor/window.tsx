import { Panel, Window as WindowComponent } from "src/ui/components";
import { Zone } from "src/engine/objects";
import ZoneEditor from "src/editor/components/zone-editor/view";
import "./window.scss";
import Sidebar from "./sidebar";
import SidebarLayer from "src/editor/components/zone-editor/sidebar-layer";
import Layer from "src/editor/components/zone-editor/layer";
import SidebarLayersCell, {
	Events as LayerChangeEvents
} from "src/editor/components/zone-editor/sidebar-layers-cell";
import Tile from "src/engine/objects/tile";
import SidebarCell from "src/editor/components/zone-editor/sidebar-cell";
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
import PopoverTilePicker, {
	Events as PopoverTilePickerEvents
} from "src/editor/components/popover-tile-picker";
import DataManager from "src/editor/data-manager";
import AbstractDrawingTool from "src/editor/tools/abstract-drawing-tool";
import { ActionEditor } from "src/editor/components";
import { ActionDescription } from "src/editor/components/zone-editor/action";

class Window extends Panel {
	public static readonly tagName = "wf-zone-editor-window";
	private _zone: Zone;
	private _editor: ZoneEditor;
	private _state: Storage;
	private _sidebar: Sidebar;
	private _providedItems: HTMLElement;
	private _requiredItems: HTMLElement;
	private _goalItems: HTMLElement;
	private _puzzleNPCs: HTMLElement;
	private _providedItemsCell: SidebarCell;
	private _requiredItemsCell: SidebarCell;
	private _goalItemsCell: SidebarCell;
	private _puzzleNPCsCell: SidebarCell;
	private _tilePicker: PopoverTilePicker;
	private _data: DataManager;
	private _tools: AbstractTool[];
	private _actionsWindow: WindowComponent;

	constructor() {
		super();

		this.pinnable = true;

		this._sidebar = <Sidebar /> as Sidebar;
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

		this._editor = <ZoneEditor /> as ZoneEditor;

		this._tools = [new NoTool(), new PencilTool(), new RectangleTool(), new PaintBucketTool()];
		const toolComponents = this._tools.map(t => this._buildToolItem(t)) as HTMLElement[];
		const actionComponents = [
			{
				name: "Edit Scripts",
				icon: "fa-code",
				command: () => this._editActions()
			}
		].map(a => this._buildActionItem(a));

		this._tilePicker = <PopoverTilePicker /> as PopoverTilePicker;
		this._tilePicker.addEventListener(
			PopoverTilePickerEvents.TileDidChange,
			(e: CustomEvent) => {
				this._tilePickerTileChanged();
				e.stopImmediatePropagation();
				e.preventDefault();
			}
		);
		this._sidebar.addEntry(
			[this._tilePicker as HTMLElement].concat(toolComponents.concat(actionComponents)),
			"Tools"
		);

		this._requiredItems = <div />;
		this._requiredItemsCell = this._sidebar.addEntry(this._requiredItems, "Required Items");
		this._providedItems = <div />;
		this._providedItemsCell = this._sidebar.addEntry(this._providedItems, "Provided Items");
		this._goalItems = <div />;
		this._goalItemsCell = this._sidebar.addEntry(this._goalItems, "Goal Items");
		this._puzzleNPCs = <div />;
		this._puzzleNPCsCell = this._sidebar.addEntry(this._puzzleNPCs, "NPCs");

		this._editor.tool = this._tools[0];
		this._tilePicker.currentTile = null;
		layers.activateLayer(0);
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.content.appendChild(this._sidebar);
		this.content.appendChild(this._editor);
	}

	private _tilePickerTileChanged() {
		const tile = this._tilePicker.currentTile;
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

	private _buildTileNode(tile: Tile) {
		return (
			<div className={"tile " + this.data.tileSheet.cssClassesForTile(tile.id).join(" ")} />
		);
	}

	private _buildToolItem(tool: AbstractTool) {
		const thing = <ToolComponent tool={tool} editor={this._editor} /> as ToolComponent;
		tool.addEventListener(AbstractTool.Event.ChangedTiles, (e: TileChangeEvent) =>
			this._editor.redraw(e.affectedPoints)
		);
		return thing;
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

		if (state.load("visible")) {
			this.show();
		}
	}

	get state() {
		return this._state;
	}

	set zone(zone: Zone) {
		this.title = `Zone ${zone.id} (${zone.type.name}, ${zone.planet.name})`;
		this.content.style.width = 2 + 160 + zone.size.width * 32 + "px";
		this.content.style.height = 2 + zone.size.height * 32 + "px";

		this._providedItems.textContent = "";
		zone.providedItems.forEach(tile =>
			this._providedItems.appendChild(this._buildTileNode(tile))
		);
		this._providedItemsCell.style.display = zone.providedItems.length ? "" : "none";
		this._requiredItems.textContent = "";
		zone.requiredItems.forEach(tile =>
			this._requiredItems.appendChild(this._buildTileNode(tile))
		);
		this._requiredItemsCell.style.display = zone.requiredItems.length ? "" : "none";
		this._goalItems.textContent = "";
		zone.goalItems.forEach(tile => this._goalItems.appendChild(this._buildTileNode(tile)));
		this._goalItemsCell.style.display = zone.goalItems.length ? "" : "none";
		this._puzzleNPCs.textContent = "";
		zone.puzzleNPCs.forEach(npc => this._puzzleNPCs.appendChild(this._buildTileNode(npc)));
		this._puzzleNPCsCell.style.display = zone.puzzleNPCs.length ? "" : "none";

		this._zone = zone;
		this._editor.zone = zone;
	}

	get zone() {
		return this._zone;
	}

	public set data(d) {
		this._data = d;
		this._editor.palette = d.palette;
		this._tilePicker.data = this.data;
	}

	public get data() {
		return this._data;
	}
}

export default Window;
