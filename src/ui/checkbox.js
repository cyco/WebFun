import View from './view';
import '/util';

export default class Checkbox extends View {
	constructor(title, element) {
		super(element || document.createElement('span'));

		this.element.classList.add('Checkbox');

		const boxID = String.UUID();

		const box = document.createElement('input');
		box.type = 'checkbox';
		box.id = boxID;
		this.element.appendChild(box);
		this._box = box;

		const label = document.createElement('label');
		label.append(title);
		label.setAttribute('for', boxID);
		this._label = label;
		this.element.appendChild(label);
	}

	get title() {
		return this._label.textContent;
	}

	set title(t) {
		this._label.clear();
		this._label.append(t);
	}

	get checked() {
		return this._box.checked;
	}
	set checked(c) {
		this._box.checked = c;
	}

	set onchange(f) {
		this._box.onchange = f;
	}
	get onchange() {
		return this._box.onchange;
	}
}
