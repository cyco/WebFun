import Component from "../component";
import "./progress-bar.scss";

class ProgressBar extends Component {
	public static readonly tagName = "wf-progress-bar";
	private _indicator: HTMLElement = <div />;
	private _value: number = 0;

	connectedCallback() {
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
