import { Popover } from "src/ui/components";
import { dispatch } from "src/util";
import ModalSession from "./modal-session";

class PopoverModalSession extends ModalSession {
	private _popover: Popover;

	constructor(popover: Popover) {
		super();
		this._popover = popover;
	}

	run() {
		this._overlay.appendChild(this._popover);
		super.run();
	}

	_whenOverlayIsGone(callback: Function) {
		// HACK: give WebKit time to remove the overlay, so elementFromPoint works correctly
		if (document.elementFromPoint(0, 0) === this._overlay) {
			dispatch(() => this._whenOverlayIsGone(callback), 1);
			return;
		}

		this._popover.remove();

		callback();
	}
}

export default PopoverModalSession;