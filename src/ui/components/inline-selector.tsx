import "./inline-selector.scss";

import Component from "../component";

class InlineSelector<T> extends Component implements EventListenerObject {
	public static readonly tagName = "wf-inline-selector";
	private _options: { label: string; value: T }[] = [];
	private _value: T = null;

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("mousedown", this);
		this.addEventListener("mouseup", this);
		this.addEventListener("click", this);
	}

	handleEvent(e: MouseEvent) {
		e.stopPropagation();
		e.stopImmediatePropagation();

		if (e.type === "mousedown" && e.target === this) {
			const index = this.indexOfSelectedOption();
			const select = (
				<select
					value={index.toString()}
					onchange={(e: CustomEvent) => {
						this.value = this.options[+select.value].value;
						select.remove();
						e.stopPropagation();
						this.dispatchEvent(new CustomEvent("change"));
					}}
					onblur={() => select.remove()}
				>
					{this.options.map(({ label }, idx) => (
						<option selected={idx === index} value={idx.toString()}>
							{label}
						</option>
					))}
				</select>
			) as HTMLSelectElement;
			this.appendChild(select);
			setTimeout(() => select.open());
		}
	}

	disconnectedCallback() {
		this.removeEventListener("mousedown", this);
		this.removeEventListener("mouseup", this);
		this.removeEventListener("click", this);
		super.disconnectedCallback();
	}

	set options(o: { label: string; value: T }[]) {
		this._options = o;
	}

	get options() {
		return this._options;
	}

	set value(v: T) {
		const option = this.options.find(({ value }) => value === v) || this.options.first();

		this._value = option.value;
		this.textContent = option.label;
	}

	get value() {
		return this._value;
	}

	private indexOfSelectedOption() {
		return this.options.findIndex(({ value }) => value === this.value) || 0;
	}
}

export default InlineSelector;
