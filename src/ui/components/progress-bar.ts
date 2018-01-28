import Component from "../component";
import "./progress-bar.scss";

class ProgressBar extends Component {
	public static readonly TagName = "wf-progress-bar";
	private _value: number = 0;

	get value() {
		return this._value;
	}

	set value(progress) {
		const maxNumberOfSegments = 24;

		const numberOfSegments = Math.min(Math.round(progress * maxNumberOfSegments), maxNumberOfSegments);

		while (this.children.length < numberOfSegments) this.appendChild(document.createElement("div"));

		while (this.children.length > numberOfSegments) this.firstElementChild.remove();

		this._value = progress;
		this.dataset && (this.dataset.value = `${progress}`);
	}
}

export default ProgressBar;
