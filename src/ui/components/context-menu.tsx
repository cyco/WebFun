import MenuWindow from "./menu-window";
import MenuItem from "./menu-item";
import "./context-menu.scss";

class ContextMenu extends MenuWindow implements EventListenerObject {
	static tagName = "wf-context-menu";

	protected connectedCallback() {
		super.connectedCallback();

		document.addEventListener("mousemove", this);
		document.addEventListener("mousedown", this);
		document.addEventListener("mouseup", this);
		document.addEventListener("contextmenu", this, { capture: true });
		document.addEventListener("keydown", this);
	}

	public handleEvent(e: MouseEvent | KeyboardEvent) {
		switch (e.type) {
			case "mouseup":
				const node = (e.target as Element).closest(MenuItem.tagName) as MenuItem;
				if (node && node.item.enabled) {
					this.stack.clear();

					if (node.item.callback) node.item.callback();
				}
				break;
		}

		e.stopPropagation();
		e.preventDefault();
		return false;
	}

	protected disconnectedCallback() {
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mousedown", this);
		document.removeEventListener("mouseup", this);
		document.removeEventListener("contextmenu", this, { capture: true });
		document.removeEventListener("keydown", this);

		super.disconnectedCallback();
	}
}

export default ContextMenu;
