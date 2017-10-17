import { EventTarget } from "src/util";
import RadioButton from "./radio-button";

class RadioGroup extends EventTarget {
	private _buttons: RadioButton[];
	private _id: string;

	constructor(buttons: RadioButton[] = []) {
		super();

		const self = this;
		this._buttons = [];
		this._id = String.UUID();
		buttons.forEach((b) => self.addButton(b));
	}

	addButton(button: RadioButton) {
		this._buttons.push(button);
		button.groupID = this._id;
	}

	get buttons() {
		return this._buttons;
	}
}

export default RadioGroup;
