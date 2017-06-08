import { Component } from '/ui';
import { ZoneSelection } from '/editor/components';
import {ZoneEditor} from './zone';
import "./zones-editor.scss";

export default class extends Component {
	static get TagName() {
		return 'wf-editor-zones';
	}

	constructor() {
		super();
		this._data = null;

		this._zoneSelection = document.createElement(ZoneSelection.TagName);
		this._zoneSelection.onzonechange = () => this._zoneEditor.zone = this._zoneSelection.selectedZone;
		this._zoneEditor = document.createElement(ZoneEditor.TagName);
	}

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._zoneSelection);
		this.appendChild(this._zoneEditor);
	}

	set data(d) {
		this._data = d;
		this._zoneSelection.zones = d.zones;
		this._zoneEditor.data = d;
	}

	get data() {
		return this._data;
	}
}
