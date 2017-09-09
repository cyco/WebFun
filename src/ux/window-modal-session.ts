import { dispatch } from "src/util";
import ModalSession from "./modal-session";
import { Window } from "src/ui/components";

class WindowModalSession extends ModalSession {
	private _window: Window;

	constructor(window: Window) {
		super();
		this._window = window;
	}

	run() {
		this._overlay.appendChild(this._window);
		super.run();
		this._window.center();
	}

	_whenOverlayIsGone(callback: Function) {
		// HACK: give WebKit time to remove the overlay, so elementFromPoint works correctly
		if (document.elementFromPoint(0, 0) === this._overlay) {
			dispatch(() => this._whenOverlayIsGone(callback), 1);
			return;
		}

		this._window.remove();

		callback();
	}
}

export default WindowModalSession;
