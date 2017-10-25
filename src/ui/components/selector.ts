import Component from "src/ui/component";

class Selector extends Component {
	public static readonly TagName = "wf-selector";
	private element: HTMLSelectElement = document.createElement("select");

	public connectedCallback() {
		super.connectedCallback();
		this.appendChild(this.element);
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
