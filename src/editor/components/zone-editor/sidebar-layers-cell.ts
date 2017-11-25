import { Zone } from "src/engine/objects";
import { List } from "src/ui/components";
import "./sidebar-layers-cell.scss";
import SidebarLayer from "./sidebar-layer";
import Layer from "./layer";
import Component from "src/ui/component";
import { Shortcut } from "src/ux";
import ShortcutManager from "src/ux/shortcut-manager";
import Window from "./window";

export const Events = {
	LayerDidChange: "LayerDidChange"
};

class SidebarLayersCell extends Component {
	static readonly TagName = "wf-zone-editor-sidebar-layers-cell";
	private _layers: Layer[];
	private _list: List<Layer>;
	private _shortcuts: Shortcut[];

	constructor() {
		super();

		this._list = <List<Layer>>document.createElement(List.TagName);
		this._list.cell = <SidebarLayer>document.createElement(SidebarLayer.TagName);
		this._list.cell.onclick = (e: MouseEvent) => this.activateLayerForCell(<SidebarLayer>e.currentTarget);

		this._buildLayers();
	}

	private _buildLayers() {
		this._layers = [];

		const roof = new Layer();
		roof.name = "Roof";
		roof.layer = Zone.Layer.Roof;
		roof.visible = true;
		roof.locked = false;
		this._layers.push(roof);

		const objects = new Layer();
		objects.name = "Objects";
		objects.layer = Zone.Layer.Object;
		objects.visible = true;
		objects.locked = false;
		this._layers.push(objects);

		const floor = new Layer();
		floor.name = "Floor";
		floor.layer = Zone.Layer.Floor;
		floor.visible = true;
		floor.locked = false;
		this._layers.push(floor);
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._list);
		this._list.items = this._layers;

		this._registerShortcuts();
	}

	disconnectedCallback() {
		this._list.remove();

		super.disconnectedCallback();

		this._unregisterShortcuts();
	}

	_registerShortcuts() {
		console.log("Register Shortcuts");
		this._shortcuts = [];

		const node = this.closest(Window.TagName);
		const manager = ShortcutManager.sharedManager;
		this._shortcuts.push(manager.registerShortcut(() => this._activateLayer(0), {
			ctrlKey: true,
			keyCode: 51,
			node
		}));
		this._shortcuts.push(manager.registerShortcut(() => this._activateLayer(1), {
			ctrlKey: true,
			keyCode: 50,
			node
		}));
		this._shortcuts.push(manager.registerShortcut(() => this._activateLayer(2), {
			ctrlKey: true,
			keyCode: 49,
			node
		}));
		this._shortcuts.push(manager.registerShortcut(() => this._toggleVisiblilty(), {ctrlKey: true, keyCode: 188}));
		this._shortcuts.push(manager.registerShortcut(() => this._toggleLock(), {ctrlKey: true, keyCode: 190}));
	}

	_unregisterShortcuts() {
		this._shortcuts.forEach(sc => ShortcutManager.sharedManager.unregisterShortcut(sc));
		this._shortcuts = [];
	}

	private _toggleVisiblilty() {
		const layer = this.activeLayer;
		if (!layer) return;

		const iconButton = <HTMLElement>layer.querySelector("i.fa-eye,i.fa-eye-slash");
		if (!iconButton) return;

		iconButton.onclick(new MouseEvent("click"));
	}

	private _toggleLock() {
		const layer = this.activeLayer;
		if (!layer) return;

		const iconButton = <HTMLElement>layer.querySelector("i.fa-lock,i.fa-unlock-alt");
		if (!iconButton) return;

		iconButton.onclick(new MouseEvent("click"));
	}

	private get activeLayer() {
		return <SidebarLayer>this.querySelector(SidebarLayer.TagName + ".active");
	}

	private _activateLayer(idx: number) {
		const layer = <SidebarLayer>this.querySelectorAll(SidebarLayer.TagName)[idx];
		if (layer.classList.contains("active")) return;
		this.activateLayerForCell(layer);
	}

	public activateLayerForCell(cell: SidebarLayer) {
		const currentLayer = this._list.querySelector(SidebarLayer.TagName + ".active");
		if (currentLayer) currentLayer.classList.remove("active");

		cell.classList.add("active");

		const layerIdx = cell.data.layer;
		this.dispatchEvent(new CustomEvent(Events.LayerDidChange, {detail: {layer: layerIdx}, bubbles: true}));
	}
}

export default SidebarLayersCell;
