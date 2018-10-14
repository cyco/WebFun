import { AbstractIconButton } from "src/ui/components";
import "./expand-button.scss";

class ExpandButton extends AbstractIconButton {
	public static readonly tagName = "wf-editor-expand-button";
	public onexpand: () => void = () => null;
	public oncollapse: () => void = () => null;
	public ontoggle: () => void = () => null;
	public element: HTMLElement = null;

	constructor() {
		super();

		this.icon = "chevron-right";
		this.onclick = () => this.toggle();
	}

	public toggle() {
		if (this.expandableElement.classList.contains("expanded")) {
			this.collapse();
		} else {
			this.expand();
		}
	}

	public expand() {
		if (this.expandableElement.classList.contains("expanded")) {
			return;
		}

		this.expandableElement.classList.add("expanded");
		if (this.onexpand instanceof Function) this.onexpand();
		if (this.ontoggle instanceof Function) this.ontoggle();
	}

	public collapse() {
		if (!this.expandableElement.classList.contains("expanded")) {
			return;
		}

		this.expandableElement.classList.remove("expanded");
		if (this.oncollapse instanceof Function) this.oncollapse();
		if (this.ontoggle instanceof Function) this.ontoggle();
	}

	private get expandableElement() {
		return this.element || this.parentElement;
	}
}

export default ExpandButton;
