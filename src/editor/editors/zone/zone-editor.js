import "./zone-editor.scss";
import { Component } from "src/ui";
import { Group } from "src/ui/components";
import { ActionList, LayerSelection, TileSelection, Toolbar, ToolbarItem, Zone } from "src/editor/components";
import * as Tools from "./tools";

const ToolStorageKey = "editor.zone.tool";
export default class extends Component {
	static get TagName() {
		return "wf-editor-zone-editor";
	}

	constructor() {
		super();
		this._data = null;
		this._zone = null;

		this.currentLayer = null;
		this._currentTile = null;
		this._currentTool = null;

		this._layerSelection = document.createElement(LayerSelection.TagName);
		this._layerSelection.onmaskchange = () => this._zoneView.layerMask = this._layerSelection.mask;
		this._layerSelection.onlayerchange = () => this.currentLayer = this._layerSelection.layer;

		this._tileSelection = document.createElement(TileSelection.TagName);
		this._tileSelection.ontilechange = () => this.currentTile = this._tileSelection.selectedTile;

		this._zoneView = document.createElement(Zone.TagName);
		this._zoneView.layerMask = this._layerSelection.mask;
		this.currentLayer = this._layerSelection.layer;
		this.currentTile = this._tileSelection.selectedTile;

		this._sidebar = document.createElement(Group.TagName);
		this._sidebar.appendChild(this._layerSelection);
		this._sidebar.appendChild(this._tileSelection);

		this._actionList = document.createElement(ActionList.TagName);

		this._toolbar = document.createElement(Toolbar.TagName);
		this._toolbar.ontoolchange = (tool) => this.activateTool(tool);

		const toggleSize = document.createElement(ToolbarItem.TagName);
		toggleSize.onclick = () => this.toggleSize();
		toggleSize.tool = { name: "Toggle Size", icon: "" };
		this._toolbar.appendChild(toggleSize);


		Object.values(Tools).forEach(Tool => this._toolbar.addTool(new Tool()));
	}

	connectedCallback() {
		super.connectedCallback();
		this.clear();

		const lastToolName = localStorage.load(ToolStorageKey);
		const tools = this._toolbar.tools;
		const tool = tools.find(tool => tool.name === lastToolName) || tools.first();
		this._toolbar.selectTool(tool);

		let group = document.createElement(Group.TagName);
		group.appendChild(this._toolbar);
		group.appendChild(this._zoneView);
		this.appendChild(group);
		this.appendChild(this._sidebar);

		this.appendChild(this._actionList);
	}

	activateTool(tool) {
		if (this._zoneView.currentTool) {
			this._zoneView.currentTool.deactivate(this);
			this._zoneView.currentTool = null;
		}

		localStorage.store(ToolStorageKey, tool && tool.name);
		this._zoneView.tool = tool;

		if (this._zoneView.tool) {
			tool.activate(this);
		}
	}

	toggleSize() {
		let desiredEdgeLength = this._zone.width === 9 ? 18 : 9;
		if (desiredEdgeLength === 9 && !confirm("Do you really want to resize the zone?")) return;

		const desiredSize = desiredEdgeLength * desiredEdgeLength;
		const newTileIDs = new Array(desiredSize * 3);
		for (let i = 0; i < desiredSize * 3; i++) {
			newTileIDs[ i ] = 0xFFFF;
		}

		let srcOffset = desiredSize === 9 ? 4 : 0;
		let targetOffset = desiredSize === 9 ? 0 : 4;
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				for (let z = 0; z < 3; z++) {
					newTileIDs[ 3 * ((y + targetOffset) * desiredEdgeLength + (x + targetOffset)) + z ] = this._zone.getTileID(x + srcOffset, y + srcOffset, z);
				}
			}
		}

		this._zone._tileIDs = newTileIDs;
		this._zone._width = desiredEdgeLength;
		this._zone._height = desiredEdgeLength;

		// TODO: remove hotspots outside of new size
		this._zone._hotspots = this.zone.hotspots.filter(htsp => htsp.x < desiredEdgeLength && htsp.y < desiredEdgeLength);
	}

	get data() {
		return this._data;
	}

	set data(d) {
		this._data = d;
		this._tileSelection.tiles = d.tiles;
	}

	get zone() {
		return this._zone;
	}

	set zone(z) {
		this._zone = z;
		this._zoneView.zone = z;
		this._actionList.zone = z;
	}

	get currentTile() {
		return this._currentTile;
	}

	set currentTile(t) {
		this._currentTile = t;
		this._tileSelection.selectedTile = t;
	}
}
