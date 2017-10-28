import Component from "src/ui/component";

class Cell<T> extends Component {
	public static readonly TagName:string = "wf-cell";
	public static readonly observedAttributes: string[] = [];

	public data: T;
}

export default Cell;
