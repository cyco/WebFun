import { KeyEvent } from "src/std.dom";
import { EventTarget } from "src/util";

export const Event = {
	DidConfirm: "DidConfirm",
	DidCancel: "DidCancel",
	DidEnd: "DidEnd"
};

class FieldEditor extends EventTarget {
	public onconfirm: () => void;
	public onend: () => void;
	public oncancel: () => void;

	private _originalContent: string;
	private _originalOnBlur: (this: HTMLElement, ev: FocusEvent) => any;
	private _originalOnKeyDown: (this: HTMLElement, ev: KeyboardEvent) => any;
	private _originalOnKeyUp: (this: HTMLElement, ev: KeyboardEvent) => any;
	private _originalOnPaste: (this: HTMLElement, ev: ClipboardEvent) => any;
	private _node: HTMLElement;

	constructor(node: HTMLElement) {
		super();

		this._prepareNode(node);
		this._setFocus();
	}

	private _prepareNode(node: HTMLElement): void {
		this._originalContent = node.innerHTML;
		this._originalOnBlur = node.onblur;
		this._originalOnKeyDown = node.onkeydown;
		this._originalOnKeyUp = node.onkeyup;
		this._originalOnPaste = node.onpaste;

		node.setAttribute("contenteditable", "true");
		node.onblur = (e) => this.confirm(e);
		node.onkeydown = (e) => this._onKeyDown(e);
		node.onpaste = (e) => {
			e.preventDefault();
			const text = e.clipboardData.getData("text/plain");
			document.execCommand("insertHTML", false, text);
		};
		node.style.textOverflow = "clip";
		node.focus();

		this._node = node;
	}


	private _restoreNode() {
		this._node.removeAttribute("contenteditable");
		this._node.onblur = this._originalOnBlur;
		this._node.onpaste = this._originalOnPaste;
		this._node.onkeydown = this._originalOnKeyDown;
		this._node.onkeyup = this._originalOnKeyUp;
		this._node.style.textOverflow = "";

		this._node.blur();
	}

	private _restoreNodeContents() {
		this._node.innerHTML = this._originalContent;
	}

	private _setFocus() {
		const node = this._node;
		const selection = document.getSelection();
		selection.removeAllRanges();

		const range = document.createRange();
		range.selectNodeContents(node);
		selection.addRange(range);
	}

	private _onKeyDown(e: KeyboardEvent) {
		if (e.which === KeyEvent.DOM_VK_RETURN || e.which === KeyEvent.DOM_VK_ENTER) {
			this.confirm(e);
		} else if (e.which === KeyEvent.DOM_VK_ESCAPE) {
			this.cancel(e);
		}
	}

	private confirm(event: Event) {
		if (event) event.preventDefault();
		this.dispatchEvent(new CustomEvent(Event.DidConfirm));
		if (this.onconfirm instanceof Function) this.onconfirm();

		this._restoreNode();
		this.dispatchEvent(new CustomEvent(Event.DidEnd));
		if (this.onend instanceof Function) this.onend();
	}

	private cancel(event: Event) {
		if (event) event.preventDefault();
		this.dispatchEvent(new CustomEvent(Event.DidCancel));
		if (this.oncancel instanceof Function) this.oncancel();
		this._restoreNode();
		this._restoreNodeContents();
		this.dispatchEvent(new CustomEvent(Event.DidEnd));
		if (this.onend instanceof Function) this.onend();
	}
}

export default FieldEditor;
