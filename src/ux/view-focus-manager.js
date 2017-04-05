import { EventTarget } from "/util";

export const Event = {
	FocusWillChange: "FocusWillChange",
	FocusDidChange: "FocusDidChange"
};

let sharedFocusManager = null;
export default class ViewFocusManager extends EventTarget {
	static get sharedManager() {
		return (sharedFocusManager = sharedFocusManager || new ViewFocusManager());
	}

	constructor() {
		super();

		this.registerEvents(ViewFocusManager.Event);
		this._focusedView = null;
	}

	focusView(view) {
		if (this._focusedView) this._focusedView.element.classList.remove("focused");
		this._focusedView = view;
		if (this._focusedView) this._focusedView.element.classList.add("focused");
	}

	blurView(view) {
		if (view && view !== this._focusedView) return;

		if (this._focusedView) this._focusedView.element.classList.add("focused");
		this._focusedView = null;
	}

	get focusedView() {
		return this._focusedView;
	}
}
