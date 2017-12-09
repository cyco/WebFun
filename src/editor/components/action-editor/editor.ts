import Component from "src/ui/component";
import { Action } from "src/engine/objects";
import Printer from "src/editor/components/action-editor/printer";
import Disassembler from "src/editor/components/action-editor/disassembler";
import { Shortcut } from "src/ux";
import ShortcutManager from "src/ux/shortcut-manager";
import "./editor.scss";
import Zone from "src/engine/objects/zone";
import { AssemblerInputError, default as Assembler } from "src/editor/components/action-editor/assembler";
import { default as Parser, ParserError } from "src/editor/components/action-editor/parser";
import MutableAction from "src/engine/mutable-objects/mutable-action";
import MutableZone from "src/engine/mutable-objects/mutable-zone";
import ArgumentProcessor from "./argument-processor";
import Token from "src/editor/components/action-editor/token";
import GameData from "src/engine/game-data";

class Editor extends Component {
	static readonly TagName = "wf-action-editor";
	static readonly observedAttributes: string[] = [];
	private _actions: Action[];
	private _shortcuts: Shortcut[];
	private _errorArea: HTMLDivElement;
	private _editorArea: HTMLDivElement;
	private _zone: Zone;
	public data: GameData;

	constructor() {
		super();

		this._errorArea = document.createElement("div");
		this._errorArea.classList.add("error-area");
		this._errorArea.style.display = "none";
	}

	connectedCallback() {
		super.connectedCallback();
		this.registerShortcuts();
	}

	private registerShortcuts() {
		this._shortcuts = [];
		const manager = ShortcutManager.sharedManager;
		let shortcut;
		shortcut = manager.registerShortcut(() => this.save(), {node: this, metaKey: true, keyCode: 83});
		this._shortcuts.push(shortcut);

		shortcut = manager.registerShortcut(() => this.indent(), {node: this, keyCode: 9});
		this._shortcuts.push(shortcut);
	}

	public save() {
		const parser = new Parser();
		const assembler = new Assembler();

		const input = this._editorArea.textContent;
		const ast = parser.parse(input);

		const errors: Error[] = [];
		const actions = ast.map((ast, idx) => {
			try {
				const action = new MutableAction(assembler.assemble(ast));
				action.id = idx;
				action.zone = this._zone;
				return action;
			} catch (e) {
				errors.push(e);
				return null;
			}
		});
		this._showErrors(errors);
		if (!errors.length) {
			(<MutableZone>this._zone).actions = actions;
			this.actions = actions;
		}
	}

	public indent() {

	}

	private unregisterShortcuts() {
		const manager = ShortcutManager.sharedManager;
		this._shortcuts.forEach(sc => manager.unregisterShortcut(sc));
		this._shortcuts = [];
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.unregisterShortcuts();
	}

	set zone(zone: Zone) {
		this._zone = zone;
		this.actions = zone.actions;
	}

	get zone() {
		return this._zone;
	}

	private set actions(actions: Action[]) {
		this._actions = actions;

		const div = document.createElement("div");
		div.classList.add("editor-area");
		div.spellcheck = false;
		div.setAttribute("contenteditable", "");

		const printer = new Printer();
		printer.tagName = Token.TagName;
		const disassembler = new Disassembler();
		const argumentProcessor = new ArgumentProcessor(this.data);

		const errors: Error[] = [];
		this._actions.forEach((action, idx) => {
			try {
				let ast = disassembler.disassemble(action);
				div.innerHTML += (idx === 0 ? "" : "<br><br>") + printer.pprint(ast);
			} catch (e) {
				errors.push(e);
			}
		});

		this._showErrors(errors);

		this.textContent = "";
		this._editorArea = argumentProcessor.process(div);
		this.appendChild(this._errorArea);
		this.appendChild(div);
	}

	private _showErrors(errors: Error[]) {
		if (!errors || errors.length === 0) {
			this._errorArea.style.display = "none";
			this.style.setProperty("--error-height", "0px");
			return;
		}

		this._errorArea.textContent = errors.map(e => {
			console.log(e);
			if (e instanceof ParserError) {
				return "SyntaxError: " + e.message;
			} else if (e instanceof AssemblerInputError) {
				return "Assembler Error: " + e.message;
			}
			return "Error: " + e.message;
		}).join("\n");
		this._errorArea.style.display = "";
		this.style.setProperty("--error-height", this._errorArea.getBoundingClientRect().height + "px");
	}

	private get actions() {
		return this._actions;
	}
}

export default Editor;
