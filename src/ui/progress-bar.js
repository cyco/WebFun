import View from './view';

export default class extends View {
	constructor() {
		super();

		this.element.classList.add('progress-bar');
		this._value = 0;
	}

	set value(progress) {
		const maxNumberOfSegments = 24;
		const node = this.element;

		const numberOfSegments = Math.min(Math.round(progress * maxNumberOfSegments), maxNumberOfSegments);

		while (node.childNodes.length < numberOfSegments)
			node.appendChild(document.createElement('div'));

		while (node.childNodes.length > numberOfSegments)
			node.firstChild.remove();

		this._value = progress;
		this.element.dataset && (this.element.dataset.value = progress);
	}

	get value() {
		return this._value;
	}
}
