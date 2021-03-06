import "./sidebar.scss";

import Component from "src/ui/component";
import SidebarCell from "./sidebar-cell";

class Sidebar extends Component {
	static readonly tagName = "wf-zone-editor-sidebar";
	private _state: Storage;

	addEntry(
		node: HTMLElement | HTMLElement[],
		name: string,
		newItemCallback?: () => void
	): SidebarCell {
		const cell = document.createElement(SidebarCell.tagName) as SidebarCell;
		cell.name = name;

		if (this.state) cell.expanded = this.state.load("name") || false;

		if (node instanceof HTMLElement) {
			cell.appendChild(node);
		} else node.forEach(node => cell.appendChild(node));

		if (newItemCallback) cell.newItemCallback = newItemCallback;

		this.appendChild(cell);
		return cell;
	}

	set state(state: Storage) {
		this._state = state;

		const cells = Array.from(this.children).filter(c => c instanceof SidebarCell) as SidebarCell[];
		cells.forEach(c => (c.state = this.state.prefixedWith(c.name)));
	}

	get state(): Storage {
		return this._state;
	}
}

export default Sidebar;
