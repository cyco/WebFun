import { Component } from "/ui";
import "./zone-preview.scss";

export default class extends Component {
	static get TagName() {
		return "wf-editor-zone-preview";
	}

	_draw() {
		this.clear();
		this.innerHTML = `Zone ${this._zone.id}`;
	}

	set zone(t) {
		this._zone = t;
		this._draw();
	}

	get zone() {
		return this._zone;
	}
}
