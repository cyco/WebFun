import IconButton from './icon-button';

export default class extends IconButton {
	static get TagName() {
		return 'wf-button';
	}

	connectedCallback() {
		this.appendChild(document.createElement('div'));
		this.appendChild(this._icon);
	}

	disconnectedCallback() {}
}
