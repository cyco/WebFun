import "./sidebar-layers-cell.scss";

import Component from "src/ui/component";
import Layer from "./layer";
import { List } from "src/ui/components";
import { Shortcut } from "src/ux";
import ShortcutManager from "src/ux/shortcut-manager";
import SidebarLayer from "./sidebar-layer";
import Window from "./window";
import { Zone } from "src/engine/objects";

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

		this._list = document.createElement(List.tagName) as List<Layer>;
		this._list.cell = document.createElement(SidebarLayer.tagName) as SidebarLayer;
		this._list.cell.onclick = (e: MouseEvent) =>
			this.activateLayerForCell(e.currentTarget as SidebarLayer);

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

		const monsters = new Layer();
		monsters.id = -2;
		monsters.name = "Monsters";
		monsters.visible = true;
		monsters.locked = false;
		this._layers.push(monsters);

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

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(this._list);

		this._registerShortcuts();
	}

	protected disconnectedCallback(): void {
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
			manager.registerShortcut(() => this._toggleVisibility(), {
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

	private _toggleVisibility() {
		this._toggle(["i.fa-eye", "i.fa-eye-slash"].join(","));
	}

	private _toggleLock() {
		this._toggle(["i.fa-lock", "i.fa-unlock-alt"].join(","));
	}

	private _toggle(iconButtonSelector: string) {
		const layer = this.activeLayer;
		if (!layer) return;

		const iconButton = layer.querySelector(iconButtonSelector) as HTMLElement;
		if (!iconButton) return;

		iconButton.onclick(new MouseEvent("click"));
	}

	private get activeLayer() {
		return this.querySelector(SidebarLayer.tagName + ".active") as SidebarLayer;
	}

	public activateLayer(idx: number) {
		const layer = this._list.querySelectorAll(SidebarLayer.tagName)[idx] as SidebarLayer;
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
