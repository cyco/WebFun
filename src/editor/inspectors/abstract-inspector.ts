import { Window } from "src/ui/components";
import DataManager from "src/editor/data-manager";

abstract class AbstractInspector {
	public state: Storage;
	public window: Window = <Window>document.createElement(Window.TagName);
	private _data: DataManager;
	private _handlers = {
		windowDidClose: () => this.state.store("visible", false)
	};

	constructor() {
		this.window.addEventListener(Window.Event.DidClose, this._handlers.windowDidClose);
	}

	show() {
		document.body.appendChild(this.window);
		this.state.store("visible", true);
	}

	set data(manager: DataManager) {
		this._data = manager;
		this.restoreState();
	}

	get data() {
		return this._data;
	}

	protected restoreState() {
		if (this.state.load("visible")) this.show();
	}
}

export default AbstractInspector;
