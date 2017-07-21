import { Component } from "/ui";
import ZonePreview from "./zone-preview";
import "./zone-selection.scss";

export default class extends Component {
	static get TagName() {
		return 'wf-editor-zone-selection';
	}

	constructor() {
		super();

		this._zones = [];
		this._selectedZone = null;
		this._selectedZoneNode = null;
		this.onzonechange = null;
	}

	_draw() {
		this.clear();
		this._zones.forEach(zone => {
			const node = document.createElement(ZonePreview.TagName);
			node.zone = zone;
			node.onclick = () => this.selectZone(zone, node);
			this.appendChild(node);
		});
	}

	set zones(t) {
		this._zones = t;
		this._draw();
	}

	get zones() {
		return this._zones;
	}

	selectZone(zone, node) {
		if (this._selectedZoneNode) {
			this._selectedZoneNode.removeAttribute('selected');
		}

		this._selectedZone = zone;
		this._selectedZoneNode = node;

		if (this._selectedZoneNode) {
			this._selectedZoneNode.setAttribute('selected', '');
		}

		if (this.onzonechange instanceof Function) {
			this.onzonechange();
		}
	}

	get selectedZone() {
		return this._selectedZone;
	}
}
