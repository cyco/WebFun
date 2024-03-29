import "./editor.scss";

import {
	AssemblerInputError,
	default as Assembler
} from "src/app/editor/components/action-editor/assembler";
import { default as Parser, ParserError } from "src/app/editor/components/action-editor/parser";

import { Action, Zone } from "src/engine/objects";
import ArgumentProcessor from "./argument-processor";
import Component from "src/ui/component";
import Disassembler from "src/app/editor/components/action-editor/disassembler";
import AssetManager from "src/engine/asset-manager";
import Printer from "src/app/editor/components/action-editor/printer";
import { Shortcut } from "src/ux";
import ShortcutManager from "src/ux/shortcut-manager";
import Token from "src/app/editor/components/action-editor/token";

class Editor extends Component {
	static readonly tagName = "wf-action-editor";
	static readonly observedAttributes: string[] = [];
	private _actions: Action[];
	private _shortcuts: Shortcut[];
	private readonly _errorArea: HTMLDivElement;
	private _editorArea: HTMLDivElement;
	private _zone: Zone;
	public assets: AssetManager;

	constructor() {
		super();

		this._errorArea = document.createElement("div");
		this._errorArea.classList.add("error-area");
		this._errorArea.style.display = "none";
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.registerShortcuts();
	}

	private registerShortcuts() {
		this._shortcuts = [];
		const manager = ShortcutManager.sharedManager;
		const shortcut = manager.registerShortcut(() => this.save(), {
			node: this,
			metaKey: true,
			keyCode: 83
		});
		this._shortcuts.push(shortcut);
	}

	public save(): void {
		const parser = new Parser();
		const assembler = new Assembler();

		const input = this._editorArea.textContent;
		const ast = parser.parse(input);

		const errors: Error[] = [];
		const actions = ast.map((ast, idx) => {
			try {
				return new Action(idx, this._zone, assembler.assemble(ast));
			} catch (e) {
				errors.push(e);
				return null;
			}
		});
		this._showErrors(errors);
		if (!errors.length) {
			(this._zone as Zone).actions = actions;
			this.actions = actions;
		}
	}

	private unregisterShortcuts() {
		const manager = ShortcutManager.sharedManager;
		this._shortcuts.forEach(sc => manager.unregisterShortcut(sc));
		this._shortcuts = [];
	}

	protected disconnectedCallback(): void {
		super.disconnectedCallback();
		this.unregisterShortcuts();
	}

	set zone(zone: Zone) {
		this._zone = zone;
		this.actions = zone.actions;
	}

	get zone(): Zone {
		return this._zone;
	}

	private set actions(actions: Action[]) {
		this._actions = actions;

		const div = document.createElement("div");
		div.classList.add("editor-area");
		div.spellcheck = false;
		div.setAttribute("contenteditable", "");

		const printer = new Printer();
		printer.tagName = Token.tagName;
		const disassembler = new Disassembler();
		const argumentProcessor = new ArgumentProcessor(this.assets);

		const errors: Error[] = [];
		this._actions.forEach((action, idx) => {
			try {
				const ast = disassembler.disassemble(action);
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

		this._errorArea.textContent = errors
			.map(e => {
				console.log(e);
				if (e instanceof ParserError) {
					return "SyntaxError: " + e.message;
				} else if (e instanceof AssemblerInputError) {
					return "Assembler Error: " + e.message;
				}
				return "Error: " + e.message;
			})
			.join("\n");
		this._errorArea.style.display = "";
		this.style.setProperty("--error-height", this._errorArea.getBoundingClientRect().height + "px");
	}
}

export default Editor;
