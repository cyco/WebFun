import ModalSession from "./modal-session";
import { AbstractWindow, Window } from "src/ui/components";
import { dispatch } from "src/util";

class WindowModalSession extends ModalSession {
	private _window: Window;

	constructor(window: Window) {
		super();
		this._window = window;
	}

	public run(): void {
		this._overlay.appendChild(this._window);
		super.run();
		this._window.center();
	}

	public runForWindow(window: AbstractWindow): void {
		super.runForWindow(window);
		this._overlay.appendChild(this._window);
	}

	protected _whenOverlayIsGone(callback: Function): void {
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
