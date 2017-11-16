import Component from "src/ui/component";
import { AbstractTool, Events } from "src/editor/tools";
import Editor from "./view";
import "./tool.scss";

class ToolComponent extends Component implements EventListenerObject {
	public static readonly TagName = "wf-zone-editor-tool";
	public static readonly observedAttributes: string[] = [];

	private _tool: AbstractTool;
	public editor: Editor;

	connectedCallback() {
		super.connectedCallback();

		this.classList.add("fa");
		this.onclick = () => this.editor.activateTool(this.tool);
	}

	disconnectedCallback() {
		this.onclick = () => null;
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
