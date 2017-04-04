import { dispatch } from '/util';

import ModalSession from './modal-session';

export default class extends ModalSession {
	constructor(window) {
		super();
		this._window = window;
	}

	run() {
		this._overlay.appendChild(this._window.element);
		super.run();
		this._window.center();
	}

	_whenOverlayIsGone(callback) {
		// hack to give webkit time to remove the overlay, so elementFromPoint works correctly
		if (document.elementFromPoint(0, 0) === this._overlay) {
			dispatch(() => this._whenOverlayIsGone(callback), 1);
			return;
		}

		this._window.element.remove();

		callback();
	}
}
