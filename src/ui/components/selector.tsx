import "./selector.scss";

import Component from "src/ui/component";

class Selector extends Component {
	public static readonly tagName = "wf-selector";
	private element: HTMLSelectElement = (<select />) as HTMLSelectElement;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.appendChild(this.element);
		this.appendChild(<i className="fa fa-caret-down" />);
	}

	public focus() {
		this.element.focus();
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
		this.element.options.forEach(c => (c.selected = false));
		const option = this.element.options.find(c => c.value === v);
		if (option) option.selected = true;
	}

	public addOption(label: string, value?: string): void {
		this.element.appendChild(
			<option selected={value === this.value} value={value !== undefined ? value : label}>
				{label || value}
			</option>
		);
	}

	set options(options: string[] | { label: string; value: string }[]) {
		(options as any).forEach((option: any) =>
			typeof option === "string"
				? this.addOption(option, option)
				: this.addOption(option.label, option.value)
		);
	}

	public removeAllOptions() {
		this.element.textContent = "";
	}

	public removeOption(value: string) {
		const option = this.element.options.find(c => c.value === value);
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
