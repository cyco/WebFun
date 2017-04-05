import View from "./view";

export default class TableViewRow extends View {
	constructor(element) {
		super(element);

		this.element.classList.add("row");
		this._model = null;
	}

	setData(model) {
		this._model = model;
	}

	getData() {
		return this._model;
	}

	get isSelectable() {
		return true;
	}

	set selected(flag) {
		if (flag) this.element.classList.add("selected");
		else this.element.classList.remove("selected");
	}

	get selected() {
		return this.element.classList.contains("selected");
	}
}
