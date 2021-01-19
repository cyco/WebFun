import Component from "src/ui/component";

abstract class Cell<T> extends Component {
	protected _data: T;
	public static readonly observedAttributes: string[] = [];

	public set data(d: T) {
		this._data = d;
	}
	public get data(): T {
		return this._data;
	}
}

export default Cell;
