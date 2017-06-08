import IconButton from './icon-button';
import './button.scss';

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
