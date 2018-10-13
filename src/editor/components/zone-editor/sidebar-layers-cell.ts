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
	static readonly tagName = "wf-zone-editor-sidebar-layers-cell";
	private _layers: Layer[];
	private _list: List<Layer>;
	private _shortcuts: Shortcut[];

	constructor() {
		super();

		this._list = <List<Layer>>document.createElement(List.tagName);
		this._list.cell = <SidebarLayer>document.createElement(SidebarLayer.tagName);
		this._list.cell.onclick = (e: MouseEvent) => this.activateLayerForCell(<SidebarLayer>e.currentTarget);

		this._buildLayers();
		this._list.items = this._layers;
	}

	private _buildLayers() {
		this._layers = [];

		const hotspots = new Layer();
		hotspots.id = -1;
		hotspots.name = "Hotspots";
		hotspots.visible = true;
		hotspots.locked = false;
		this._layers.push(hotspots);

		const npcs = new Layer();
		npcs.id = -2;
		npcs.name = "NPCs";
		npcs.visible = true;
		npcs.locked = false;
		this._layers.push(npcs);

		const roof = new Layer();
		roof.id = Zone.Layer.Roof;
		roof.name = "Roof";
		roof.visible = true;
		roof.locked = false;
		this._layers.push(roof);

		const objects = new Layer();
		objects.id = Zone.Layer.Object;
		objects.name = "Objects";
		objects.visible = true;
		objects.locked = false;
		this._layers.push(objects);

		const floor = new Layer();
		floor.id = Zone.Layer.Floor;
		floor.name = "Floor";
		floor.visible = true;
		floor.locked = false;
		this._layers.push(floor);
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._list);

		this._registerShortcuts();
	}

	protected disconnectedCallback() {
		this._list.remove();

		super.disconnectedCallback();

		this._unregisterShortcuts();
	}

	private _registerShortcuts() {
		this._shortcuts = [];

		const node = this.closest(Window.tagName);
		const manager = ShortcutManager.sharedManager;
		this._shortcuts.push(
			manager.registerShortcut(() => this.activateLayer(4), {
				ctrlKey: true,
				keyCode: 53,
				node
			})
		);
		this._shortcuts.push(
			manager.registerShortcut(() => this.activateLayer(3), {
				ctrlKey: true,
				keyCode: 52,
				node
			})
		);
		this._shortcuts.push(
			manager.registerShortcut(() => this.activateLayer(2), {
				ctrlKey: true,
				keyCode: 51,
				node
			})
		);
		this._shortcuts.push(
			manager.registerShortcut(() => this.activateLayer(1), {
				ctrlKey: true,
				keyCode: 50,
				node
			})
		);
		this._shortcuts.push(
			manager.registerShortcut(() => this.activateLayer(0), {
				ctrlKey: true,
				keyCode: 49,
				node
			})
		);
		this._shortcuts.push(
			manager.registerShortcut(() => this._toggleVisiblilty(), {
				ctrlKey: true,
				keyCode: 188
			})
		);
		this._shortcuts.push(
			manager.registerShortcut(() => this._toggleLock(), { ctrlKey: true, keyCode: 190 })
		);
	}

	private _unregisterShortcuts() {
		this._shortcuts.forEach(sc => ShortcutManager.sharedManager.unregisterShortcut(sc));
		this._shortcuts = [];
	}

	private _toggleVisiblilty() {
		this._toggle(["i.fa-eye", "i.fa-eye-slash"].join(","));
	}

	private _toggleLock() {
		this._toggle(["i.fa-lock", "i.fa-unlock-alt"].join(","));
	}

	private _toggle(iconButtonSelector: string) {
		const layer = this.activeLayer;
		if (!layer) return;

		const iconButton = <HTMLElement>layer.querySelector(iconButtonSelector);
		if (!iconButton) return;

		iconButton.onclick(new MouseEvent("click"));
	}

	private get activeLayer() {
		return <SidebarLayer>this.querySelector(SidebarLayer.tagName + ".active");
	}

	public activateLayer(idx: number) {
		const layer = <SidebarLayer>this._list.querySelectorAll(SidebarLayer.tagName)[idx];
		if (layer.classList.contains("active")) return;
		this.activateLayerForCell(layer);
	}

	public activateLayerForCell(cell: SidebarLayer) {
		const currentLayer = this._list.querySelector(SidebarLayer.tagName + ".active");
		if (currentLayer) currentLayer.classList.remove("active");

		cell.classList.add("active");

		const layer = cell.data;
		this.dispatchEvent(
			new CustomEvent(Events.LayerDidChange, { detail: { layer: layer }, bubbles: true })
		);
	}
}

export default SidebarLayersCell;
