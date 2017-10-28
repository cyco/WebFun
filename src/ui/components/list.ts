import Component from "../component";
import Cell from "./cell";
import './list.scss';

class List<T> extends Component {
	public static readonly TagName = "wf-list";
	public static readonly observedAttributes: string[] = [];

	public cell: Cell<T>;
	private _items: T[] = [];

	private rebuild() {
		this.textContent = "";
		this._items.forEach((i) => this.addItem(i));
	}

	private addItem(item: T) {
		const cell = <Cell<T>>this.cell.cloneNode(true);
		cell.data = item;
		this.appendChild(cell);
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
