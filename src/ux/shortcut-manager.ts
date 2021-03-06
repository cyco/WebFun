import { and } from "src/util/functional";
import identity from "src/util/identity";

export declare interface ShortcutDescription {
	node?: Node;
	keyCode?: number;
	key?: string;
	metaKey?: boolean;
	ctrlKey?: boolean;
}

export type Shortcut = number;
type RegisteredShortcut = [ShortcutDescription, () => void];

class ShortcutManager implements EventListenerObject {
	private static _sharedManager: ShortcutManager;
	public static get sharedManager(): ShortcutManager {
		return (this._sharedManager = this._sharedManager || new ShortcutManager());
	}

	private _plainKeyShortcutCount = 0;
	private _shortcuts: RegisteredShortcut[];
	private _node: Node;

	constructor() {
		this._shortcuts = [];
		window.addEventListener("keydown", this, true);
		window.addEventListener("focus", this, true);
		window.addEventListener("mousedown", this, true);
	}

	public registerShortcut(callback: () => void, shortcut: ShortcutDescription): Shortcut {
		let index = this._shortcuts.indexOf(null);
		if (index === -1) {
			index = this._shortcuts.length;
			this._shortcuts.push(null);
		}
		if (!shortcut.metaKey && !shortcut.ctrlKey) this._plainKeyShortcutCount++;

		this._shortcuts[index] = [shortcut, callback];
		return index;
	}

	public unregisterShortcut(shortcut: Shortcut): void {
		const description = this._shortcuts[shortcut];
		if (!description) return;
		if (!description[0].metaKey && !description[0].ctrlKey) this._plainKeyShortcutCount--;
		this._shortcuts[shortcut] = null;
	}

	handleEvent(e: FocusEvent | MouseEvent | KeyboardEvent): void {
		if (e instanceof MouseEvent || e instanceof FocusEvent) {
			this._node = e.target instanceof Node ? e.target : null;
			return;
		}

		const currentKey = e.key;
		const currentKeyCode = e.keyCode;
		const currentMetaKey = e.metaKey;
		const currentCtrlKey = e.ctrlKey;

		if (!currentCtrlKey && !currentMetaKey && this._plainKeyShortcutCount === 0) return;

		const keyMatches = ([{ key }]: RegisteredShortcut) => key === undefined || key === currentKey;
		const keyCodeMatches = ([{ keyCode }]: RegisteredShortcut) =>
			keyCode === undefined || keyCode === currentKeyCode;
		const ctrlKeyMatches = ([{ ctrlKey }]: RegisteredShortcut) =>
			ctrlKey === undefined || ctrlKey === currentCtrlKey;
		const metaKeyMatches = ([{ metaKey }]: RegisteredShortcut) =>
			metaKey === undefined || metaKey === currentMetaKey;
		const isInNode = ([{ node }]: RegisteredShortcut) =>
			!node || (this._node && node.contains(this._node));

		const [, callback] = this._shortcuts.find(
			and(identity, keyMatches, keyCodeMatches, ctrlKeyMatches, metaKeyMatches, isInNode)
		) || [null, null];

		if (callback instanceof Function) {
			callback();

			e.preventDefault();
			e.stopImmediatePropagation();
		}
	}
}

export default ShortcutManager;
