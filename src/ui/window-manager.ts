import { Window } from "src/ui/components";

class WindowManager {
	public static readonly defaultManager = new WindowManager();
	private _windows: Window[] = [];
	private _topIndex = 0;
	private _topMostWindow: Window;

	private _handlers = {
		windowDidClose: (e: CustomEvent) => this._onWindowClose(e)
	};

	showWindow(window: Window) {
		this._windows.push(window);
		window.addEventListener(Window.Event.DidClose, this._handlers.windowDidClose);
		document.body.appendChild(window);

		this.focus(window);
	}

	_onWindowClose(e: CustomEvent) {
		console.log(e.target);
		const window = <Window>e.target;

		this._windows.splice(this._windows.indexOf(window), 1);
		if (window == this._topMostWindow) {
			const newTopMostWindow = this._windows.reduce((a: Window, b: Window) => {
				if (!a) return b;
				if (!b) return a;
				if (a.style.zIndex >= b.style.zIndex) return a;
				return a;
			}, null);
			if (newTopMostWindow) this.focus(newTopMostWindow);
		}
	}

	public focus(window: Window) {
		window.style.zIndex = `${this._topIndex++}`;
		this._topMostWindow = window;
	}
}

export default WindowManager;
