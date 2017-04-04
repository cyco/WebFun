import EventTarget from '/util/event-target';
export default class RadioGroup extends EventTarget {
	constructor(buttons = []) {
		super();

		const self = this;
		this._buttons = [];
		this._id = String.UUID();
		buttons.forEach((b) => self.addButton(b));

		Object.seal(this);
	}

	addButton(button) {
		this._buttons.push(button);
		button.groupID = this._id;
	}

	get buttons() {
		return this._buttons;
	}
};
