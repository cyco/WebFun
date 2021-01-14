import { Panel, Window } from "src/ui/components";

import DataManager from "src/app/editor/data-manager";
import WindowManager from "src/ui/window-manager";

const StateStorageDelay = 1.0;

abstract class AbstractInspector {
	public state: Storage;
	public window: Window = document.createElement(Panel.tagName) as Window;
	public windowManager: WindowManager;
	private _data: DataManager;
	private _stateUpdateDelay: number;
	private _handlers = {
		windowDidClose: () => this.state.store("visible", false)
	};

	constructor(state: Storage) {
		this.state = state;
		this.window.addEventListener(Window.Event.DidClose, this._handlers.windowDidClose);
	}

	abstract build(): void;

	show() {
		this.state.store("visible", true);
		this.windowManager.showWindow(this.window);
	}

	set data(manager: DataManager) {
		this._data = manager;
		this.build();
		this.restoreState();
	}

	get data() {
		return this._data;
	}

	protected stateDidChange() {
		if (this._stateUpdateDelay) return;
		this._stateUpdateDelay = setTimeout(() => this.updateState(), StateStorageDelay);
	}

	protected updateState() {
		if (this._stateUpdateDelay) {
			clearTimeout(this._stateUpdateDelay);
		}
		this._stateUpdateDelay = null;
	}

	protected restoreState() {
		if (this.state.load("visible")) this.show();
	}
}

export default AbstractInspector;
