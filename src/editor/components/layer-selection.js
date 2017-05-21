import { Component } from '/ui';
import { DrawMask } from './zone';
import Layer from './layer';
import { Layer as ZoneLayer } from '/engine/objects/zone';

const MaskKey = 'editor.layerMask';
const LayerKey = 'editor.layer';

export default class extends Component {
	static get TagName() {
		return 'wf-editor-layer-selection';
	}

	constructor() {
		super();

		const lastMask = localStorage.has(MaskKey) ? localStorage.load(MaskKey) : DrawMask.All;

		this._hotspot = document.createElement(Layer.TagName);
		this._hotspot.name = 'Hotspot';
		this._hotspot.visible = lastMask & DrawMask.Hotspot;
		this._hotspot.onchange = () => this._visibilityDidChange();
		this._hotspot.onselect = () => this._layerDidChange(this._hotspot);

		this._roof = document.createElement(Layer.TagName);
		this._roof.name = 'Roof';
		this._roof.visible = lastMask & DrawMask.Roof;
		this._roof.onchange = () => this._visibilityDidChange();
		this._roof.onselect = () => this._layerDidChange(this._roof, ZoneLayer.Roof);

		this._objects = document.createElement(Layer.TagName);
		this._objects.name = 'Objects';
		this._objects.visible = lastMask & DrawMask.Objects;
		this._objects.onchange = () => this._visibilityDidChange();
		this._objects.onselect = () => this._layerDidChange(this._objects, ZoneLayer.Object);

		this._floor = document.createElement(Layer.TagName);
		this._floor.name = 'Floor';
		this._floor.visible = lastMask & DrawMask.Floor;
		this._floor.onchange = () => this._visibilityDidChange();
		this._floor.onselect = () => this._layerDidChange(this._floor, ZoneLayer.Floor);

		this._selectedLayer = ZoneLayer.Floor;
		this._restoreCurrentLayer();

		this.onmaskchange = null;
		this.onlayerchange = null;
	}

	_restoreCurrentLayer() {
		const lastLayer = localStorage.has(LayerKey) ? localStorage.load(LayerKey) : 'Hotspot';

		let node = null;
		switch (lastLayer) {
			case 'Hotspot':
				node = this._hotspot;
				break;
			case 'Roof':
				node = this._roof;
				this._selectedLayer = ZoneLayer.Roof;
				break;
			case 'Objects':
				node = this._objects;
				this._selectedLayer = ZoneLayer.Object;
				break;
			case 'Floor':
				node = this._floor;
				this._selectedLayer = ZoneLayer.Floor;
				break;
		}

		node.setAttribute('selected', '');
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._hotspot);
		this.appendChild(this._roof);
		this.appendChild(this._objects);
		this.appendChild(this._floor);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.clear();
	}

	_visibilityDidChange() {
		if (this.onmaskchange instanceof Function) {
			this.onmaskchange();
		}

		localStorage.store(MaskKey, this.mask);
	}

	_layerDidChange(newSelection, newLayer) {
		const currentSelection = this.querySelector(Layer.TagName + '[selected]');
		if (currentSelection) currentSelection.removeAttribute('selected');
		if (newSelection) newSelection.setAttribute('selected', '');

		this._selectedLayer = newLayer;
		localStorage.store(LayerKey, newSelection.name);
		
		if(this.onlayerchange instanceof Function)
			this.onlayerchange();
	}

	get layer() {
		return this._selectedLayer;
	}

	get mask() {
		let result = DrawMask.None;
		if (this._hotspot.visible) result |= DrawMask.Hotspot;
		if (this._roof.visible) result |= DrawMask.Roof;
		if (this._objects.visible) result |= DrawMask.Objects;
		if (this._floor.visible) result |= DrawMask.Floor;
		return result;
	}
}
