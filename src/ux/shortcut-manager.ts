declare interface ShortcutDescription {
	node?: Node;
	keyCode?: number;
}

export type Shortcut = number;

class ShortcutManager implements EventListenerObject {
	private static _sharedManager: ShortcutManager;
	public static get sharedManager() {
		return this._sharedManager = this._sharedManager || new ShortcutManager();
	}

	private _shortcuts: [ShortcutDescription, () => void][];
	private _node: Node;

	constructor() {
		this._shortcuts = [];
		window.addEventListener("keydown", this, true);
		window.addEventListener("mousedown", this, true);
	}

	registerShortcut(callback: () => void, shortcut: ShortcutDescription): Shortcut {
		let index = this._shortcuts.indexOf(null);
		if (index === -1) {
			index = this._shortcuts.length;
			this._shortcuts.push(null);
		}

		this._shortcuts[index] = [shortcut, callback];
		return index;
	}

	unregisterShortcut(shortcut: Shortcut) {
		this._shortcuts[shortcut] = null;
	}

	handleEvent(e: MouseEvent|KeyboardEvent) {
		if (e instanceof MouseEvent) {
			this._node = e.target instanceof Node ? e.target : null;
			return;
		}


		if (!e.metaKey) return;

		const currentKeyCode = e.keyCode;

		let [_, callback] = this._shortcuts
			.filter(s => s)
			.filter(([{keyCode}]) => keyCode === undefined || keyCode === currentKeyCode)
			.filter(([{node}]) => !node || this._node && node.contains(this._node))
			.first() || [null, null];

		if (callback instanceof Function) {
			callback();
			e.preventDefault();
			e.stopImmediatePropagation();
		}
	}
}

export default ShortcutManager;
