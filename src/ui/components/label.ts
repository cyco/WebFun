import Component from "../component";
import { FieldEditor } from "src/ux";
import "./label.scss";

class Label extends Component implements EventListenerObject {
	public static readonly TagName = "wf-label";
	public static readonly observedAttributes: string[] = [];
	private _editor: FieldEditor;

	constructor() {
		super();

		this.addEventListener("dblclick", this);
	}

	handleEvent(e: MouseEvent) {
		if (e.type !== "dblclick") return;
		if (this._editor) return;
		e.preventDefault();
		this.beginEditing();
	}

	private _triggerOnChange() {
		this.dispatchEvent(new Event("change"));
	}

	beginEditing() {
		if (this._editor) return;

		const editor = new FieldEditor(this);
		editor.onconfirm = () => this._triggerOnChange();
		editor.onend = () => this.endEditing();
		this._editor = editor;
	}

	endEditing() {
		if (!this._editor) return;

		this._editor = null;
		this.scrollLeft = 0;
		this.scrollTop = 0;
	}
}

export default Label;
