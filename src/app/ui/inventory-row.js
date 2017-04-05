import { TableViewRow } from "/ui";

export default class InventoryRow extends TableViewRow {
	constructor(inventory, element) {
		super(element);

		const tileBackgound = document.createElement("span");
		tileBackgound.classList.add("icon");
		this.element.appendChild(tileBackgound);

		this._iconElement = document.createElement("img");
		this._nameElement = document.createElement("span");
		this._nameElement.classList.add("name");

		this.element.appendChild(this._iconElement);
		this.element.appendChild(this._nameElement);
	}

	setData(model) {
		this._iconElement.src = Image.blankImage;
		this._nameElement.textContent = "";

		if (model) {
			this._nameElement.textContent = model.name;
			this._iconElement.src = model.image.dataURL;
		}
	}
}
