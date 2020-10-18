import "./context-menu.scss";

import AbstractMenuWindow from "./abstract-menu-window";
import MenuItem from "./menu-item";

class ContextMenu extends AbstractMenuWindow implements EventListenerObject {
	public static readonly tagName = "wf-context-menu";

	protected connectedCallback(): void {
		super.connectedCallback();

		document.addEventListener("mousemove", this);
		document.addEventListener("mousedown", this);
		document.addEventListener("mouseup", this);
		document.addEventListener("contextmenu", this, { capture: true });
		document.addEventListener("keydown", this);
	}

	public handleEvent(e: MouseEvent | KeyboardEvent): void {
		if (e.type === "mouseup") {
			const node = (e.target as Element).closest(MenuItem.tagName) as MenuItem;
			if (node && node.item.enabled) {
				this.stack.clear();

				if (node.item.callback) node.item.callback();
			}
		}

		e.stopPropagation();
		e.preventDefault();
	}

	protected disconnectedCallback(): void {
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mousedown", this);
		document.removeEventListener("mouseup", this);
		document.removeEventListener("contextmenu", this, { capture: true });
		document.removeEventListener("keydown", this);

		super.disconnectedCallback();
	}
}

export default ContextMenu;
