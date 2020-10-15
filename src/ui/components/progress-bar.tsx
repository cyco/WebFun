import "./progress-bar.scss";

import Component from "../component";

class ProgressBar extends Component {
	public static readonly tagName = "wf-progress-bar";
	private _indicator: HTMLElement = (<div />);
	private _value: number = 0;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.appendChild(this._indicator);
	}

	get value() {
		return this._value;
	}

	set value(progress) {
		this._value = progress;
		this._indicator.style.width = `${(progress * 100).toString()}%`;
	}
}

export default ProgressBar;
