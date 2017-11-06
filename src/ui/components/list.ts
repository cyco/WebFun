import Component from "../component";
import Cell from "./cell";
import "./list.scss";
import SearchBar from "./search-bar";
import { Shortcut, ShortcutManager } from "src/ux";

class List<T> extends Component {
	public static readonly TagName = "wf-list";
	public static readonly observedAttributes: string[] = [];

	public cell: Cell<T>;
	private _bar: SearchBar;
	private _content: HTMLElement;
	private _items: T[] = [];
	private _cells: Cell<T>[] = [];
	private _shortcut: Shortcut;

	constructor() {
		super();

		this._bar = <SearchBar>document.createElement(SearchBar.TagName);
		this._bar.onclose = () => this._bar.removeAttribute("visible");
		this._content = document.createElement("div");
	}

	connectedCallback() {
		this.appendChild(this._bar);
		this.rebuild();
		this.appendChild(this._content);

		const shortcutManager = ShortcutManager.sharedManager;
		this._shortcut = shortcutManager.registerShortcut(() => this._showSearchbar(), {
			keyCode: 70,
			node: this
		});
	}

	private _showSearchbar() {
		this._bar.setAttribute("visible", "");
	}

	disconnectedCallback() {
		this._bar.remove();

		this._cells.forEach(c => c.remove());
		this._cells = [];

		const shortcutManager = ShortcutManager.sharedManager;
		shortcutManager.unregisterShortcut(this._shortcut);
	}

	private rebuild() {
		this._cells.forEach(c => c.remove());
		this._cells = this._items.map((i) => this.addItem(i));
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
