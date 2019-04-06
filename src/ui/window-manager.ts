import { AbstractWindow } from "src/ui/components";

class WindowManager {
	private static _defaultManager: WindowManager;
	private _container: HTMLElement;
	private _windows: AbstractWindow[] = [];
	private _topIndex = 0;
	private _topMostWindow: AbstractWindow;

	private _handlers = {
		windowDidClose: (e: CustomEvent) => this._onWindowClose(e)
	};

	public static get defaultManager(): WindowManager {
		return (this._defaultManager = this._defaultManager || new WindowManager(document.body));
	}

	constructor(container: HTMLElement) {
		this._container = container;
	}

	asDefaultManager(block: () => void) {
		const globalManager = WindowManager._defaultManager;
		WindowManager._defaultManager = this;
		block();
		WindowManager._defaultManager = globalManager;
	}

	showWindow(window: AbstractWindow) {
		if (!~this._windows.indexOf(window)) this._windows.push(window);
		window.manager = this;
		window.addEventListener(AbstractWindow.Event.DidClose, this._handlers.windowDidClose);
		this._container.appendChild(window);

		this.focus(window);
	}

	private _onWindowClose(e: CustomEvent) {
		const window = e.target as AbstractWindow;

		window.manager = null;
		const index = this._windows.indexOf(window);
		if (index !== -1) this._windows.splice(index, 1);
		if (window === this._topMostWindow) {
			const newTopMostWindow = this._windows.reduce((a: AbstractWindow, b: AbstractWindow) => {
				if (!a) return b;
				if (!b) return a;
				if (a.style.zIndex >= b.style.zIndex) return a;
				return b;
			}, null);
			if (newTopMostWindow) this.focus(newTopMostWindow);
		}
	}

	public focus(window: AbstractWindow) {
		if (window === this._topMostWindow) return;

		window.style.zIndex = `${this._topIndex++}`;
		this._topMostWindow = window;
	}

	public get windows() {
		return this._windows;
	}

	public get topMostWindow() {
		return this._topMostWindow;
	}
}

export default WindowManager;
