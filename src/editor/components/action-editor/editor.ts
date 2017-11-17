import Component from "src/ui/component";
import { Action } from "src/engine/objects";
import "./editor.scss";
import Parser from "src/editor/components/action-editor/parser";
import Printer from "src/editor/components/action-editor/printer";

class Editor extends Component {
	static readonly TagName = "wf-action-editor";
	static readonly observedAttributes: string[] = [];
	private _action: Action;

	connectedCallback() {
		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	set action(action: Action) {
		this._action = action;

		const parser = new Parser();
		const ast = parser.parse(action);
		const printer = new Printer();

		this.innerText = printer.print(ast);
	}

	get action() {
		return this._action;
	}
}

export default Editor;
