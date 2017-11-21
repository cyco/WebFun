import Component from "src/ui/component";
import { Window } from "src/ui/components";
import { Action } from "src/engine/objects";
import "./editor.scss";
import Printer from "src/editor/components/action-editor/printer";
import Disassembler from "src/editor/components/action-editor/disassembler";
import Assembler, { AssemblerInputError } from "src/editor/components/action-editor/assembler";
import Parser, { ParserError } from "src/editor/components/action-editor/parser";
import { Shortcut } from "src/ux";
import ShortcutManager from "src/ux/shortcut-manager";

class Editor extends Component {
	static readonly TagName = "wf-action-editor";
	static readonly observedAttributes: string[] = [];
	private _action: Action;
	private _shortcuts: Shortcut[];
	private _errorArea: HTMLDivElement;
	private _editorArea: HTMLDivElement;

	constructor() {
		super();

		this._errorArea = document.createElement("div");
		this._errorArea.classList.add("error-area");
		this._errorArea.style.display = "none";
	}

	connectedCallback() {
		super.connectedCallback();
		this.updateWindowTitle();
		this.registerShortcuts();
	}

	private registerShortcuts() {
		const manager = ShortcutManager.sharedManager;
		const shortcut = manager.registerShortcut(() => this.save(), {node: this, metaKey: true, keyCode: 83});

		this._shortcuts = [shortcut];
	}

	public save() {
		this._errorArea.textContent = "";

		const parser = new Parser();
		const assembler = new Assembler();

		try {
			const input = this._editorArea.textContent;
			const ast = parser.parse(input);
			if (ast.length !== 1)
				throw new Error(ast.length ? "Too many defintions found!" : "Not enough defintions found!");
			const action = assembler.assemble(ast.first());

			this._errorArea.style.display = "none";
			this.style.setProperty("--error-height", "0px");
		} catch (e) {
			if (e instanceof ParserError) {
				this._errorArea.textContent = "SyntaxError: " + e.message;
			} else if (e instanceof AssemblerInputError) {
				this._errorArea.textContent = "Assembler Error: " + e.message;
			} else {
				this._errorArea.textContent = "Error: " + e.message;
			}
			this._errorArea.style.display = "";
			this.style.setProperty("--error-height", this._errorArea.getBoundingClientRect().height + "px");
		}
	}

	private unregisterShortcuts() {
		const manager = ShortcutManager.sharedManager;
		this._shortcuts.forEach(sc => manager.unregisterShortcut(sc));
		this._shortcuts = [];
	}

	private updateWindowTitle() {
		if (!this._action) return;
		const window = <Window>this.closest(Window.TagName);
		if (window) window.title = `Zone ${this._action.zone.id}: Action ${this._action.id}`;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.unregisterShortcuts();
	}

	set action(action: Action) {
		this._action = action;

		const div = document.createElement("div");
		div.classList.add("editor-area");
		div.spellcheck = false;

		const printer = new Printer();
		const disassembler = new Disassembler();

		try {
			let ast = disassembler.disassemble(action);
			div.innerHTML = printer.pprint(ast);
			div.setAttribute("contenteditable", "");
		} catch (e) {
			div.innerHTML = `<span class="error">${e.message}</span><br>${printer.pprint(e.input)}`;
		}

		this.textContent = "";
		this._editorArea = div;
		this.appendChild(this._errorArea);
		this.appendChild(div);
		this.updateWindowTitle();
	}

	get action() {
		return this._action;
	}
}

export default Editor;
