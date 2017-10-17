import View from "./view";
import "./progress-bar.scss";

class ProgressBar extends View {
	private _value: number = 0;

	constructor() {
		super();

		this.element.classList.add("progress-bar");
	}

	get value() {
		return this._value;
	}

	set value(progress) {
		const maxNumberOfSegments = 24;
		const node = this.element;

		const numberOfSegments = Math.min(Math.round(progress * maxNumberOfSegments), maxNumberOfSegments);

		while (node.children.length < numberOfSegments)
			node.appendChild(document.createElement("div"));

		while (node.children.length > numberOfSegments)
			node.firstElementChild.remove();

		this._value = progress;
		this.element.dataset && (this.element.dataset.value = `${progress}`);
	}
}

export default ProgressBar;
