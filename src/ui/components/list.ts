import Component from "../component";
import Cell from "./cell";
import "./list.scss";
import SearchBar from "./search-bar";
import { Shortcut, ShortcutManager } from "src/ux";

export declare interface SearchDelegate<T, PreparedSearchValue> {
	prepareListSearch(searchValue: string, list: List<T>): PreparedSearchValue

	includeListItem(searchValue: PreparedSearchValue, item: T, cell: Cell<T>, list: List<T>): boolean;
}

const FILTER_DELAY = 100;

class List<T> extends Component {
	public static readonly TagName = "wf-list";
	public static readonly observedAttributes: string[] = [];

	public cell: Cell<T>;
	private _bar: SearchBar;
	private _content: HTMLElement;
	private _items: T[] = [];
	private _cells: Cell<T>[] = [];
	private _shortcut: Shortcut;
	public searchDelegate: SearchDelegate<T, RegExp>;
	private _filterTimeout: number;
	private _lastSearchValue: string = "";
	private _closeSearchbarShortcut: Shortcut;

	constructor() {
		super();

		this._bar = <SearchBar>document.createElement(SearchBar.TagName);
		this._content = document.createElement("div");
	}

	connectedCallback() {
		this.appendChild(this._bar);
		this.rebuild();
		this.appendChild(this._content);

		if (!this.searchDelegate) return;
		const shortcutManager = ShortcutManager.sharedManager;
		this._shortcut = shortcutManager.registerShortcut(() => this.showBar(), {
			keyCode: 70,
			node: this,
			metaKey: true
		});
	}

	private showBar() {
		this._bar.setAttribute("visible", "");
		this._bar.onsearch = () => this.setNeedsRefiltering();
		this._bar.onclose = () => this.hideBar();
		this._bar.focus();

		const shortcutManager = ShortcutManager.sharedManager;
		this._closeSearchbarShortcut = shortcutManager.registerShortcut(() => this.hideBar(), {
			keyCode: 27,
			node: this._bar
		});

		this.refilter();
	}

	private hideBar() {
		this._bar.removeAttribute("visible");
		this._bar.onsearch = null;
		this._bar.onclose = null;

		const shortcutManager = ShortcutManager.sharedManager;
		shortcutManager.unregisterShortcut(this._closeSearchbarShortcut);

		this.refilter();
	}

	disconnectedCallback() {
		this._bar.remove();

		this._cells.forEach(c => c.remove());
		this._cells = [];

		const shortcutManager = ShortcutManager.sharedManager;
		shortcutManager.unregisterShortcut(this._shortcut);
	}

	private rebuild() {
		this._lastSearchValue = "";
		this._cells.forEach(c => c.remove());
		this._cells = this._items.map((i) => this.addItem(i));
		this.refilter();
	}

	private setNeedsRefiltering() {
		if (this._filterTimeout) return;
		this._filterTimeout = setTimeout(() => this.refilter(), FILTER_DELAY);
	}

	private refilter() {
		if (this._filterTimeout) {
			clearTimeout(this._filterTimeout);
		}
		this._filterTimeout = null;

		const delegate = this.searchDelegate;
		const searchValue = this._bar.searchString;
		if (!searchValue || !delegate || !this._bar.isVisible) {
			this._lastSearchValue = "";
			this._cells.forEach(c => c.style.display = "");
			return;
		}

		if (this._lastSearchValue === searchValue) return;

		this._lastSearchValue = searchValue;
		const preparedSearchValue = delegate.prepareListSearch(searchValue, this);

		this._cells.forEach((cell) => {
			const included = delegate.includeListItem(preparedSearchValue, cell.data, cell, this);
			cell.style.display = included ? "" : "none";
		});
	}

	private addItem(item: T): Cell<T> {
		const cell = <Cell<T>>this.cell.cloneNode(true);
		cell.data = item;
		this._content.appendChild(cell);
		return cell;
	}

	public set items(items: T[]) {
		this._items = items;
		this.rebuild();
	}

	public get items() {
		return this._items;
	}
}

export default List;
