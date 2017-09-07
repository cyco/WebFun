import { dispatch } from "src/util";
import ModalSession from "./modal-session";

class WindowModalSession extends ModalSession {
	constructor(window) {
		super();
		this._window = window;
	}

	run() {
		this._overlay.appendChild(this._window);
		super.run();
		this._window.center();
	}

	_whenOverlayIsGone(callback) {
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
