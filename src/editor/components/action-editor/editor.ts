import Component from "src/ui/component";
import { Window } from "src/ui/components";
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
		this.updateWindowTitle();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	set action(action: Action) {
		this._action = action;

		const parser = new Parser();
		const ast = parser.parse(action);
		const printer = new Printer();

		this.textContent = "";
		const div = document.createElement("div");
		div.innerHTML = printer.pprint(ast);
		div.setAttribute("contenteditable", "");
		div.spellcheck = false;
		this.appendChild(div);

		this.updateWindowTitle();
	}

	private updateWindowTitle() {
		if (!this._action) return;
		const window = <Window>this.closest(Window.TagName);
		if (window) window.title = `Zone ${this._action.zone.id}: Action ${this._action.id}`;
	}

	get action() {
		return this._action;
	}
}

export default Editor;
