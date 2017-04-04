import View from './view';
export default class Selector extends View {
	constructor(element) {
		super(element || document.createElement('select'));
	}

	addOption(label, value) {
		const option = document.createElement('option');
		option.append(label || value);
		option.value = value !== undefined ? value : label;
		this.element.appendChild(option);
	}

	removeOption(value) {
		const option = this.element.querySelector('option[value=' + value + ']');
		if (option) this.element.removeChild(option);
	}

	get onchange() {
		return this.element.onchange;
	}

	set onchange(fn) {
		this.element.onchange = fn;
	}

	get value() {
		return this.element.value;
	}
}
