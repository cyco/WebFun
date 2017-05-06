import { Component } from '/ui';
import { IconButton } from '/ui/components';
import BreakpointButton from './breakpoint-button';
import Condition from './condition';
import Instruction from './instruction';
import { LocationBreakpoint } from '../breakpoint';
import { localStorage } from '/std.dom';

export default class extends Component {
	static get TagName() {
		return 'wf-debug-action';
	}

	static get observedAttributes() {
		return ['current'];
	}

	constructor() {
		super();

		this._action = null;

		this.zone = null;
		this.index = null;

		this._title = document.createElement('span');
		this._conditionContainer = document.createElement('div');
		this._conditionContainer.style.marginBottom = '10px';
		this._instructionContainer = document.createElement('div');
	}

	connectedCallback() {
		const container = document.createElement('div');
		container.classList.add('container');

		const breakpointButton = new BreakpointButton();
		breakpointButton.breakpoint = new LocationBreakpoint(this.zone, this.index);

		container.appendChild(breakpointButton);
		container.appendChild(this._title);

		const expandButton = new IconButton('caret-right');
		expandButton.classList.add('expand');
		expandButton.onclick = () => this.expanded = !this.expanded;
		container.appendChild(expandButton);

		this.appendChild(container);
		this.expanded = localStorage.load(this._storageId);
	}

	attributeChangedCallback(attribute) {}

	set action(action) {
		this._action = action;
		this._title.innerText = `Action ${action.id}`;

		const makeComponent = (ComponentClass, container) => (desc, index) => {
			const component = new ComponentClass(desc);
			component.zone = this.zone;
			component.action = this.index;
			component.index = index;
			container.appendChild(component);
		};

		action.conditions.forEach(makeComponent(Condition, this._conditionContainer));
		action.instructions.forEach(makeComponent(Instruction, this._instructionContainer));
	}

	get action() {
		return this._action;
	}

	set current(flag) {
		if (flag) this.setAttribute('current', '');
		else this.removeAttribute('current');
	}

	get current() {
		return this.hasAttribute('current');
	}

	set expanded(flag) {
		if (flag) this.classList.add('expanded');
		else this.classList.remove('expanded');

		if (flag) {
			this.appendChild(this._conditionContainer);
			this.appendChild(this._instructionContainer);
		} else {
			this._conditionContainer.remove();
			this._instructionContainer.remove();
		}

		localStorage.store(this._storageId, !!flag);
	}

	get expanded() {
		return this.classList.contains('expanded');
	}

	get _storageId() {
		return `debug.action.epanded.${this.zone}.${this.index}`;
	}
}
