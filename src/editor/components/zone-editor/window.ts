import { Window as WindowComponent } from "src/ui/components";
import { Zone } from "src/engine/objects";
import ZoneEditor from "src/editor/components/zone-editor/view";
import TileSheet from "src/editor/tile-sheet";
import { WindowManager } from "src/ui";
import "./window.scss";
import Sidebar from "./sidebar";
import SidebarLayer from "src/editor/components/zone-editor/sidebar-layer";
import Layer from "src/editor/components/zone-editor/layer";
import SidebarLayersCell from "src/editor/components/zone-editor/sidebar-layers-cell";
import Tile from "src/engine/objects/tile";
import SidebarCell from "src/editor/components/zone-editor/sidebar-cell";
import Action from "src/engine/objects/action";
import ToolComponent from "./tool";
import {
	AbstractTool,
	HotspotTool,
	NoTool,
	PaintBucketTool,
	PencilTool,
	RectangleTool,
	TileChangeEvent
} from "src/editor/tools";

class Window extends WindowComponent {
	public static readonly TagName = "wf-zone-editor-window";
	private _zone: Zone;
	private _editor: ZoneEditor;
	private _tileSheet: TileSheet;
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
	private _actionsCell: SidebarCell;
	private _toolsCell: SidebarCell;

	constructor() {
		super();

		this.pinnable = true;

		this._sidebar = <Sidebar>document.createElement(Sidebar.TagName);
		this._sidebar.addEventListener(SidebarLayer.Event.DidToggleVisibility, (e: CustomEvent) => {
			const layer = <Layer>e.detail.layer;
			this._editor.setLayerVisible(layer.layer, layer.visible);
		});

		const layers = document.createElement(SidebarLayersCell.TagName);
		this._sidebar.addEntry(layers, "Layers");

		this._editor = <ZoneEditor>document.createElement(ZoneEditor.TagName);

		const initialTool = new NoTool();
		const tools = [
			this._buildToolItem(initialTool),
			this._buildToolItem(new PencilTool()),
			this._buildToolItem(new RectangleTool()),
			this._buildToolItem(new PaintBucketTool()),
			this._buildToolItem(new HotspotTool())
		];
		this._toolsCell = this._sidebar.addEntry(tools, "Tools");

		this._requiredItems = document.createElement("div");
		this._requiredItemsCell = this._sidebar.addEntry(this._requiredItems, "Required Items");
		this._providedItems = document.createElement("div");
		this._providedItemsCell = this._sidebar.addEntry(this._providedItems, "Provided Items");
		this._goalItems = document.createElement("div");
		this._goalItemsCell = this._sidebar.addEntry(this._goalItems, "Goal Items");
		this._puzzleNPCs = document.createElement("div");
		this._puzzleNPCsCell = this._sidebar.addEntry(this._puzzleNPCs, "NPCs");
		this._actionsCell = this._sidebar.addEntry([], "Actions");

		this._editor.activateTool(initialTool);
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

		this._providedItems.textContent = "";
		zone.providedItems.forEach(tile => this._providedItems.appendChild(this._buildTileNode(tile)));
		this._providedItemsCell.style.display = zone.providedItems.length ? "" : "none";
		this._requiredItems.textContent = "";
		zone.requiredItems.forEach(tile => this._requiredItems.appendChild(this._buildTileNode(tile)));
		this._requiredItemsCell.style.display = zone.requiredItems.length ? "" : "none";
		this._goalItems.textContent = "";
		zone.goalItems.forEach(tile => this._goalItems.appendChild(this._buildTileNode(tile)));
		this._goalItemsCell.style.display = zone.goalItems.length ? "" : "none";
		this._puzzleNPCs.textContent = "";
		zone.puzzleNPCs.forEach(tile => this._puzzleNPCs.appendChild(this._buildTileNode(tile)));
		this._puzzleNPCsCell.style.display = zone.puzzleNPCs.length ? "" : "none";

		this._actionsCell.clear();
		zone.actions.forEach(action => this._createAction(action, this._actionsCell));
		this._actionsCell.style.display = zone.actions.length ? "" : "none";

		this._zone = zone;
		this._editor.zone = zone;
	}

	private _createAction(action: Action, container: HTMLElement) {
		const node = document.createElement("div");
		node.classList.add("action");
		node.textContent = `Action ${action.id} (${action.conditions.length} / ${action.instructions.length})`;
		container.appendChild(node);
	}

	private _buildTileNode(tile: Tile) {
		const node = document.createElement("div");
		node.className = "tile " + this._tileSheet.cssClassesForTile(tile.id).join(" ");
		return node;
	}

	private _buildToolItem(tool: AbstractTool) {
		const thing = <ToolComponent>document.createElement(ToolComponent.TagName);
		thing.tool = tool;
		thing.editor = this._editor;
		tool.addEventListener(AbstractTool.Event.ChangedTiles, (e: TileChangeEvent) => this._editor.redraw(e.affectedPoints));
		return thing;
	}

	get zone() {
		return this._zone;
	}
}

export default Window;
