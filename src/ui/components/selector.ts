import Component from "src/ui/component";
import "./selector.scss";

class Selector extends Component {
	public static readonly TagName = "wf-selector";
	private element: HTMLSelectElement = document.createElement("select");

	protected connectedCallback() {
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

	set value(v) {
		this.element.value = v;
	}

	public addOption(label: string, value: string) {
		const option = document.createElement("option");
		option.appendChild(document.createTextNode(label || value));
		option.value = value !== undefined ? value : label;
		this.element.appendChild(option);
	}

	public removeAllOptions() {
		this.element.textContent = "";
	}

	public removeOption(value: string) {
		const option = this.element.querySelector("option[value=" + value + "]");
		if (option) this.element.removeChild(option);
	}

	set borderless(flag: boolean) {
		if (flag) this.setAttribute("borderless", "");
		else this.removeAttribute("borderless");
	}

	get borderless() {
		return this.hasAttribute("borderless");
	}
}

export default Selector;
