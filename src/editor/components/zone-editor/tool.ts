import "./tool.scss";

import { AbstractTool, Events } from "src/editor/tools";

import Component from "src/ui/component";
import Editor from "./view";
import { Shortcut } from "src/ux";
import ShortcutManager from "src/ux/shortcut-manager";
import Window from "./window";

class ToolComponent extends Component implements EventListenerObject {
	public static readonly tagName = "wf-zone-editor-tool";
	public static readonly observedAttributes: string[] = [];

	private _tool: AbstractTool;
	public editor: Editor;
	private _shortcut: Shortcut = null;

	protected connectedCallback() {
		super.connectedCallback();

		const activateTool = () => (this.editor.tool = this.tool);
		if (this.tool && this.tool.shortcut) {
			const window = this.closest(Window.tagName);
			const description = Object.assign({}, this.tool.shortcut, { node: window });

			this._shortcut = ShortcutManager.sharedManager.registerShortcut(activateTool, description);
		}

		this.classList.add("fa");
		this.onclick = activateTool;
	}

	protected disconnectedCallback() {
		this.onclick = () => null;

		if (this._shortcut) ShortcutManager.sharedManager.unregisterShortcut(this._shortcut);
		this._shortcut = null;
	}

	public handleEvent(evt: Event): void {
		if (evt.type === Events.DidDeactivate) {
			this.removeAttribute("active");
		}

		if (evt.type === Events.DidActivate) {
			this.setAttribute("active", "");
		}
	}

	set tool(t: AbstractTool) {
		if (this._tool) {
			if (this._tool.icon) this.classList.remove(this._tool.icon);
			this._tool.removeEventListener(AbstractTool.Event.DidActivate, this);
			this._tool.removeEventListener(AbstractTool.Event.DidDeactivate, this);
		}

		this._tool = t;

		if (this._tool) {
			if (this._tool.icon) this.classList.add(this._tool.icon);
			this._tool.addEventListener(AbstractTool.Event.DidActivate, this);
			this._tool.addEventListener(AbstractTool.Event.DidDeactivate, this);
		}
	}

	get tool() {
		return this._tool;
	}
}

export default ToolComponent;
