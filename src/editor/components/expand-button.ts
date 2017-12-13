import { IconButton } from "src/ui/components";
import "./expand-button.scss";

class ExpandButton extends IconButton {
	public static readonly TagName = "wf-editor-expand-button";
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
		this.onexpand() && this.onexpand();
		this.ontoggle && this.ontoggle();
	}

	public collapse() {
		if (!this.expandableElement.classList.contains("expanded")) {
			return;
		}

		this.expandableElement.classList.remove("expanded");
		this.oncollapse && this.oncollapse();
		this.ontoggle && this.ontoggle();
	}

	private get expandableElement() {
		return this.element || this.parentElement;
	}
}

export default ExpandButton;
