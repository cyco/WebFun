import { EventTarget } from "src/util";
import RadioButton from "./radio-button";

class RadioGroup extends EventTarget {
	private _buttons: RadioButton[] = [];
	private _id = String.UUID();

	constructor(buttons: RadioButton[] = []) {
		super();

		buttons.forEach(b => this.addButton(b));
	}

	public get buttons(): RadioButton[] {
		return this._buttons;
	}

	public addButton(button: RadioButton): void {
		this._buttons.push(button);
		button.groupID = this._id;
	}
}

export default RadioGroup;
