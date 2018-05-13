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
	HotspotTool,
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
import { NPC, Hotspot } from "src/engine/objects";
import { MutableNPC, MutableHotspot } from "src/engine/mutable-objects";
import { Point } from "src/util";

import NPCComponent from "src/editor/components/zone-editor/npc";
import HotspotComponent from "src/editor/components/zone-editor/hotspot";
import List from "src/ui/components/list";

class Window extends Panel {
	public static readonly TagName = "wf-zone-editor-window";
	private _zone: Zone;
	private _editor: ZoneEditor;
	private _state: Storage;
	private _sidebar: Sidebar;
	private _providedItems: HTMLElement;
	private _requiredItems: HTMLElement;
	private _goalItems: HTMLElement;
	private _puzzleNPCs: HTMLElement;
	private _npcs: List<NPC>;
	private _providedItemsCell: SidebarCell;
	private _requiredItemsCell: SidebarCell;
	private _goalItemsCell: SidebarCell;
	private _puzzleNPCsCell: SidebarCell;
	private _npcsCell: SidebarCell;
	private _toolsCell: SidebarCell;
	private _tilePicker: PopoverTilePicker;
	private _data: DataManager;
	private _tools: AbstractTool[];
	private _actionsWindow: WindowComponent;
	private _removeNPCHandler = (e: CustomEvent) => this._removeNPC(<NPCComponent>e.target);
	private _removeHotspotHandler = (e: CustomEvent) =>
		this._removeHotspot(<HotspotComponent>e.target);
	private _hotspots: List<Hotspot>;
	private _hotspotsCell: SidebarCell;

	constructor() {
		super();

		this.pinnable = true;

		this._sidebar = <Sidebar>document.createElement(Sidebar.TagName);
		this._sidebar.addEventListener(SidebarLayer.Event.DidToggleVisibility, (e: CustomEvent) => {
			const layer = <Layer>e.detail.layer;
			this._editor.setLayerVisible(layer, layer.visible);
		});

		const layers = <SidebarLayersCell>document.createElement(SidebarLayersCell.TagName);
		layers.addEventListener(
			LayerChangeEvents.LayerDidChange,
			(e: CustomEvent) => (this._editor.currentLayer = e.detail.layer)
		);
		this._sidebar.addEntry(layers, "Layers");

		this._editor = <ZoneEditor>document.createElement(ZoneEditor.TagName);

		this._tools = [
			new NoTool(),
			new PencilTool(),
			new RectangleTool(),
			new PaintBucketTool(),
			new HotspotTool()
		];
		const toolComponents = <HTMLElement[]>this._tools.map(t => this._buildToolItem(t));
		const actionComponents = [
			{
				name: "Edit Scripts",
				icon: "fa-code",
				command: () => this._editActions()
			}
		].map(a => this._buildActionItem(a));

		this._toolsCell = this._sidebar.addEntry(toolComponents.concat(actionComponents), "Tools");

		this._tilePicker = <PopoverTilePicker>document.createElement(PopoverTilePicker.TagName);
		this._tilePicker.addEventListener(
			PopoverTilePickerEvents.TileDidChange,
			(e: CustomEvent) => {
				this._tilePickerTileChanged();
				e.stopImmediatePropagation();
				e.preventDefault();
			}
		);
		this._sidebar.addEntry(this._tilePicker, "Tiles");

		this._hotspots = this._buildHotspotList();
		this._hotspotsCell = this._sidebar.addEntry(this._hotspots, "Hotspots");

		this._requiredItems = document.createElement("div");
		this._requiredItemsCell = this._sidebar.addEntry(this._requiredItems, "Required Items");
		this._providedItems = document.createElement("div");
		this._providedItemsCell = this._sidebar.addEntry(this._providedItems, "Provided Items");
		this._goalItems = document.createElement("div");
		this._goalItemsCell = this._sidebar.addEntry(this._goalItems, "Goal Items");
		this._puzzleNPCs = document.createElement("div");
		this._puzzleNPCsCell = this._sidebar.addEntry(this._puzzleNPCs, "NPCs");
		this._npcs = this._buildNPCList();
		this._npcsCell = this._sidebar.addEntry(this._npcs, "Enemies", () => this._addNPC());

		this._editor.activateTool(this._tools[0]);
		this._tilePicker.currentTile = null;
		layers.activateLayer(0);
	}

	connectedCallback() {
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

	set state(state) {
		this._state = state;

		this.pinned = state.load("pinned");
		this.autosaveName = state.load("window-name") || state.store("window-name", String.UUID());
		this.onpin = () => this._state.store("pinned", this.pinned);

		this._sidebar.state = state.prefixedWith("sidebar");
		this._npcs.state = state.prefixedWith("npc-list");

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

		this._npcs.items = zone.npcs;
		this._hotspots.items = zone.hotspots;

		this._zone = zone;
		this._editor.zone = zone;
	}

	private _editActions() {
		if (!this._actionsWindow) {
			const window = <Panel>document.createElement(Panel.TagName);
			window.style.width = "480px";
			window.content.style.maxHeight = "630px";
			const editor = <ActionEditor>document.createElement(ActionEditor.TagName);
			window.content.appendChild(editor);
			this._actionsWindow = window;
		}

		const editor = <ActionEditor>this._actionsWindow.content.firstElementChild;
		editor.data = this._data.currentData;
		editor.zone = this.zone;
		this._actionsWindow.title = `Zone ${this.zone.id}: Actions`;
		this.manager.showWindow(this._actionsWindow);
	}

	private _buildTileNode(tile: Tile) {
		const node = document.createElement("div");
		node.className = "tile " + this.data.tileSheet.cssClassesForTile(tile.id).join(" ");
		return node;
	}

	private _buildHotspotNode(hotspot: Hotspot) {
		const node = document.createElement("div");
		node.textContent = `${hotspot.type.name} at ${hotspot.x}x${hotspot.y}`;
		return node;
	}

	private _buildToolItem(tool: AbstractTool) {
		const thing = <ToolComponent>document.createElement(ToolComponent.TagName);
		thing.tool = tool;
		thing.editor = this._editor;
		tool.addEventListener(AbstractTool.Event.ChangedTiles, (e: TileChangeEvent) =>
			this._editor.redraw(e.affectedPoints)
		);
		return thing;
	}

	private _buildActionItem(a: ActionDescription) {
		const component = <ActionComponent>document.createElement(ActionComponent.TagName);
		component.action = a;
		return component;
	}

	private _buildNPCList() {
		const list = <List<NPC>>document.createElement(List.TagName);
		list.classList.add("wf-zone-editor-npc-list");
		list.cell = <NPCComponent>document.createElement(NPCComponent.TagName);
		list.addEventListener(NPCComponent.Events.RequestRemoval, this._removeNPCHandler);

		return list;
	}

	private _buildHotspotList() {
		const list = <List<Hotspot>>document.createElement(List.TagName);
		list.classList.add("wf-zone-editor-hotspot-list");
		list.cell = <HotspotComponent>document.createElement(HotspotComponent.TagName);
		list.addEventListener(HotspotComponent.Events.RequestRemoval, this._removeHotspotHandler);

		return list;
	}

	private _removeNPC(component: NPCComponent): void {
		const allNPCNodes = Array.from(component.parentElement.childNodes);
		const index = allNPCNodes.indexOf(component);

		if (index !== -1) this._zone.npcs.splice(index, 1);
		this._npcs.items = this._zone.npcs;
	}

	private _addNPC(): void {
		const npc = new MutableNPC();
		npc.position = new Point(0, 0);
		npc.character = this.data.currentData.characters.find(c => c.isEnemy());
		this.zone.npcs.push(npc);
		this._npcs.items = this._zone.npcs;
	}

	private _removeHotspot(component: HotspotComponent): void {
		const allHotspotNodes = Array.from(component.parentElement.childNodes);
		const index = allHotspotNodes.indexOf(component);

		if (index !== -1) this._zone.hotspots.splice(index, 1);
		this._hotspots.items = this.zone.hotspots;
	}

	private _addHotspot(): void {
		const hotspot = new MutableHotspot();
		hotspot.x = 0;
		hotspot.y = 0;
		hotspot.type = Hotspot.Type.TriggerLocation;

		this.zone.hotspots.push(hotspot);
		this._hotspots.items = this._zone.hotspots;
	}

	get zone() {
		return this._zone;
	}

	public set data(d) {
		this._data = d;
		this._editor.tileSheet = d.tileSheet;
		this._tilePicker.data = this.data;

		let cell;
		cell = <NPCComponent>this._npcs.cell;
		cell.gameData = this.data.currentData;
		cell.tileSheet = this.data.tileSheet;

		cell = <HotspotComponent>this._hotspots.cell;
		cell.gameData = this.data.currentData;
		cell.tileSheet = this.data.tileSheet;
	}

	public get data() {
		return this._data;
	}
}

export default Window;
