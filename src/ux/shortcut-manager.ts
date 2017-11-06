declare interface ShortcutDescription {
	node?: Node;
	keyCode?: number;
	metaKey?: boolean;
}

export type Shortcut = number;

class ShortcutManager implements EventListenerObject {
	private static _sharedManager: ShortcutManager;
	public static get sharedManager() {
		return this._sharedManager = this._sharedManager || new ShortcutManager();
	}

	private _nonMetaShortcutCount = 0;
	private _shortcuts: [ShortcutDescription, () => void][];
	private _node: Node;

	constructor() {
		this._shortcuts = [];
		window.addEventListener("keydown", this, true);
		window.addEventListener("focus", this, true);
		window.addEventListener("mousedown", this, true);
	}

	registerShortcut(callback: () => void, shortcut: ShortcutDescription): Shortcut {
		let index = this._shortcuts.indexOf(null);
		if (index === -1) {
			index = this._shortcuts.length;
			this._shortcuts.push(null);
		}
		if (!shortcut.metaKey) this._nonMetaShortcutCount++;

		this._shortcuts[index] = [shortcut, callback];
		return index;
	}

	unregisterShortcut(shortcut: Shortcut) {
		const description = this._shortcuts[shortcut];
		if (!description) return;
		if (!description[0].metaKey) this._nonMetaShortcutCount--;
		this._shortcuts[shortcut] = null;
	}

	handleEvent(e: FocusEvent|MouseEvent|KeyboardEvent) {
		if (e instanceof MouseEvent || e instanceof FocusEvent) {
			this._node = e.target instanceof Node ? e.target : null;
			return;
		}

		if (!e.metaKey && this._nonMetaShortcutCount === 0) return;

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
