import { IconButton } from '/ui/components';
import { Component } from '/ui';
import { assemble, disassemble } from '../opcode'; 

export default class extends Component {
	static get TagName() {
		return "wf-editor-action-item";
	}

	constructor() {
		super();

		this._label = document.createElement('span');
	}

	connectedCallback() {
		super.connectedCallback();

		this.clear();

		this._editor = document.createElement('div');
		this._editor.setAttribute('contenteditable', '');

		const expandButton = new IconButton('caret-right');
		expandButton.classList.add('expand');
		expandButton.onclick = () => this.expanded = !this.expanded;
		this.appendChild(expandButton);

		this.appendChild(this._label);
		this.expanded = localStorage.load(this._storageId);
	}

	set action(action) {
		this._action = action;
		this._label.innerHTML = `Action ${action.id}`;
	}

	get action() {
		return this._action;
	}

	set expanded(flag) {
		if (flag) this.classList.add('expanded');
		else this.classList.remove('expanded');

		if (flag) {
			this.appendChild(this._editor);
			this._editor.innerText = disassemble(this.action);
		} else {
			this._editor.remove();
		}

		localStorage.store(this._storageId, !!flag);
	}

	get expanded() {
		return this.classList.contains('expanded');
	}

	get _storageId() {
		return `debug.action.epanded.${this.zoneId}.${this.action.id}`;
	}
}
