import SidebarCell from "src/editor/components/zone-editor/sidebar-cell";
import { Zone } from "src/engine/objects";
import { List } from "src/ui/components";
import "./sidebar-layers-cell.scss";
import SidebarLayer from "./sidebar-layer";
import Layer from "./layer";

class SidebarLayersCell extends SidebarCell {
	static readonly TagName = "wf-zone-editor-sidebar-layers-cell";
	private _layers: Layer[];
	private _list: List<Layer>;

	constructor() {
		super();

		this.label = "Layers";
		this._list = <List<Layer>>document.createElement(List.TagName);
		this._list.cell = <SidebarLayer>document.createElement(SidebarLayer.TagName);

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
	}

	disconnectedCallback() {
		this._list.remove();

		super.disconnectedCallback();
	}
}

export default SidebarLayersCell;
