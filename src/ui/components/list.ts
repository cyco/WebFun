import Component from "../component";
import Cell from "./cell";
import "./list.scss";
import SearchBar from "./search-bar";
import { Shortcut, ShortcutManager } from "src/ux";
import { DiscardingStorage } from "src/util";

export declare interface SearchDelegate<T, PreparedSearchValue> {
	prepareListSearch(searchValue: string, list: List<T>): PreparedSearchValue

	includeListItem(searchValue: PreparedSearchValue, item: T, cell: Cell<T>, list: List<T>): boolean;
}

const FILTER_DELAY = 100;
const SearchBarVisibleStateKey = "searchbar-visible";
const SearchValueStateKey = "search";

class List<T> extends Component {
	public static readonly TagName = "wf-list";
	public static readonly observedAttributes: string[] = [];

	public cell: Cell<T>;
	private _bar: SearchBar;
	private _content: HTMLElement;
	private _items: T[] = [];
	private _cells: Cell<T>[] = [];
	private _shortcut: Shortcut;
	public searchDelegate: SearchDelegate<T, any>;
	private _filterTimeout: number;
	private _lastSearchValue: string = "";
	private _closeSearchbarShortcut: Shortcut;
	private _state: Storage = new DiscardingStorage();

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
		this._shortcut = shortcutManager.registerShortcut(() => this.showBar(true), {
			keyCode: 70,
			node: this,
			metaKey: true
		});

		if (this.state.load(SearchBarVisibleStateKey)) {
			this.showBar(false);
		}
	}

	private showBar(updateState: boolean) {
		this._bar.setAttribute("visible", "");
		this._bar.onsearch = () => this.setNeedsRefiltering();
		this._bar.onclose = () => this.hideBar(true);
		this._bar.focus();

		const shortcutManager = ShortcutManager.sharedManager;
		this._closeSearchbarShortcut = shortcutManager.registerShortcut(() => this.hideBar(true), {
			keyCode: 27,
			node: this._bar
		});

		if (!updateState) return;

		this.state.store(SearchBarVisibleStateKey, true);
		this.refilter();
	}

	private hideBar(updateState: boolean) {
		this._bar.removeAttribute("visible");
		this._bar.onsearch = null;
		this._bar.onclose = null;

		const shortcutManager = ShortcutManager.sharedManager;
		shortcutManager.unregisterShortcut(this._closeSearchbarShortcut);

		if (!updateState) return;

		this.state.store(SearchBarVisibleStateKey, false);
		this.refilter();
	}

	disconnectedCallback() {
		this._bar.remove();
		this.hideBar(false);

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

		this.state.store(SearchValueStateKey, searchValue);

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

	set items(items: T[]) {
		this._items = items;
		this.rebuild();
	}

	get items() {
		return this._items;
	}

	set state(s: Storage) {
		this._state = s;
		this._bar.searchString = s.load(SearchValueStateKey) || "";

		if (s.load(SearchBarVisibleStateKey)) {
			this._bar.setAttribute("visible", "");
		} else {
			this._bar.removeAttribute("visible");
		}
	}

	get state() {
		return this._state;
	}
}

export default List;
