import "./sidebar.scss";
import Component from "src/ui/component";
import SidebarCell from "./sidebar-cell";

class Sidebar extends Component {
	static readonly TagName = "wf-zone-editor-sidebar";
	private _state: Storage;

	addEntry(node: HTMLElement|HTMLElement[], name: string): SidebarCell {
		const cell = <SidebarCell>document.createElement(SidebarCell.TagName);
		cell.name = name;

		if (this.state) cell.expanded = this.state.load("name") || false;

		if (node instanceof HTMLElement) {
			cell.appendChild(node);
		} else node.forEach(node => cell.appendChild(node));

		this.appendChild(cell);
		return cell;
	}

	set state(state: Storage) {
		this._state = state;

		const cells = <SidebarCell[]>Array.from(this.children).filter(c => c instanceof SidebarCell);
		cells.forEach(c => c.state = this.state.prefixedWith(c.name));
	}

	get state() {
		return this._state;
	}
}

export default Sidebar;
