import View from "./view";

class Selector extends View {
	constructor(element: HTMLSelectElement) {
		super(element || document.createElement("select"));
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

	get element(): HTMLSelectElement {
		return <HTMLSelectElement>super.element;
	}

	addOption(label: string, value: string) {
		const option = document.createElement("option");
		option.append(label || value);
		option.value = value !== undefined ? value : label;
		this.element.appendChild(option);
	}

	removeOption(value: string) {
		const option = this.element.querySelector("option[value=" + value + "]");
		if (option) this.element.removeChild(option);
	}
}

export default Selector;
