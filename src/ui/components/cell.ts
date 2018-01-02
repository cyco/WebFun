import Component from "src/ui/component";

abstract class Cell<T> extends Component {
	public static readonly observedAttributes: string[] = [];

	public data: T;
}

export default Cell;
