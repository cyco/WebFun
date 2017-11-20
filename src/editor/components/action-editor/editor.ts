import Component from "src/ui/component";
import { Window } from "src/ui/components";
import { Action } from "src/engine/objects";
import "./editor.scss";
import Printer from "src/editor/components/action-editor/printer";
import Disassembler from "src/editor/components/action-editor/disassembler";
import Assembler from "src/editor/components/action-editor/assembler";

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

		const div = document.createElement("div");
		div.spellcheck = false;

		const printer = new Printer();
		const disassembler = new Disassembler();
		const assembler = new Assembler();

		try {
			let ast = disassembler.disassemble(action);
			ast = disassembler.disassemble(assembler.assemble(ast));

			div.innerHTML = printer.pprint(ast);
			div.setAttribute("contenteditable", "");
		} catch (e) {
			div.innerHTML = `<span class="error">${e.message}</span><br>${printer.pprint(e.input)}`;
		}

		this.textContent = "";
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
