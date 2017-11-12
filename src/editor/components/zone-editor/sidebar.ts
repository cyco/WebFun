import "./sidebar.scss";
import Component from "src/ui/component";
import SidebarCell from "src/editor/components/zone-editor/sidebar-cell";


class Sidebar extends Component {
	static readonly TagName = "wf-zone-editor-sidebar";
	private _state: Storage;

	private _layers: SidebarCell;
	private _tools: SidebarCell;
	private _tiles: SidebarCell;
	private _actions: SidebarCell;

	constructor() {
		super();

		this._layers = <SidebarCell>document.createElement(SidebarCell.TagName);
		this._layers.label = "Layers";
		this._tools = <SidebarCell>document.createElement(SidebarCell.TagName);
		this._tools.label = "Tools";
		this._tiles = <SidebarCell>document.createElement(SidebarCell.TagName);
		this._tiles.label = "Tiles";
		this._actions = <SidebarCell>document.createElement(SidebarCell.TagName);
		this._actions.label = "Actions";
	}

	connectedCallback() {
		this.appendChild(this._layers);
		this.appendChild(this._tools);
		this.appendChild(this._tiles);
		this.appendChild(this._actions);
	}

	disconnectedCallback() {
		this._layers.remove();
		this._tools.remove();
		this._tiles.remove();
		this._actions.remove();
	}

	set state(state) {
		this._state = state;
		this._layers.state = state.prefixedWith("layers");
		this._tools.state = state.prefixedWith("tools");
		this._tiles.state = state.prefixedWith("tiles");
		this._actions.state = state.prefixedWith("ations");
	}

	get state() {
		return this._state;
	}
}

export default Sidebar;
