import { EventTarget } from "src/util";
import RadioButton from "./radio-button";

class RadioGroup extends EventTarget {
	private _buttons: RadioButton[];
	private _id: string;

	constructor(buttons: RadioButton[] = []) {
		super();

		this._buttons = [];
		this._id = String.UUID();
		buttons.forEach(b => this.addButton(b));
	}

	get buttons() {
		return this._buttons;
	}

	addButton(button: RadioButton) {
		this._buttons.push(button);
		button.groupID = this._id;
	}
}

export default RadioGroup;
