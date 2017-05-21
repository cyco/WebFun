import { Component } from '/ui';
import { Group } from '/ui/components';
import { LayerSelection, TileSelection, Zone, Toolbar } from '/editor/components';
import * as Tools from './tools';

const ToolStorageKey = 'editor.zone.tool';
export default class extends Component {
	static get TagName() {
		return 'wf-editor-zone-editor';
	}

	constructor() {
		super();
		this._data = null;
		this._zone = null;

		this.currentLayer = null;
		this.currentTile = null;
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

		this._toolbar = document.createElement(Toolbar.TagName);
		this._toolbar.ontoolchange = (tool) => this.activateTool(tool);
		Object.values(Tools).forEach(Tool => this._toolbar.addTool(new Tool()));
	}

	connectedCallback() {
		super.connectedCallback();
		this.clear();

		const lastToolName = localStorage.load(ToolStorageKey);
		const tools = this._toolbar.tools;
		const tool = tools.find(tool => tool.name === lastToolName) || tools.first();
		this._toolbar.selectTool(tool);
		
		const group = document.createElement(Group.TagName);
		group.appendChild(this._toolbar);
		group.appendChild(this._zoneView);
		this.appendChild(group);
		this.appendChild(this._sidebar);
	}

	set data(d) {
		this._data = d;
		this._tileSelection.tiles = d.tiles;
	}

	get data() {
		return this._data;
	}

	set zone(z) {
		this._zone = z;
		this._zoneView.zone = z;
	}

	get zone() {
		return this._zone;
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
}
