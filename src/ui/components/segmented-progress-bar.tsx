import "./segmented-progress-bar.scss";

import Component from "../component";

class SegmentedProgressBar extends Component {
	public static readonly tagName = "wf-segmented-progress-bar";
	private _value: number = 0;
	public numberOfSegments: number = 24;

	get value() {
		return this._value;
	}

	set value(progress) {
		const numberOfSegments = Math.min(Math.round(progress * this.numberOfSegments), this.numberOfSegments);

		while (this.children.length < numberOfSegments) this.appendChild(<div />);
		while (this.children.length > numberOfSegments) this.firstElementChild.remove();

		this._value = progress;
		this.dataset && (this.dataset.value = `${progress}`);
	}
}

export default SegmentedProgressBar;
