import Component from "../component";
import "./segment.scss";

class Segment extends Component {
	public static readonly tagName = "wf-segment";
	public static readonly observedAttributes = ["selected"];
	private _selected: boolean = false;

	protected attributeChangedCallback() {
		this.selected = this.hasAttribute("selected");
	}

	get selected() {
		return this._selected;
	}

	set selected(flag: boolean) {
		if (flag === this._selected) {
			return;
		}

		this._selected = flag;

		if (flag) this.setAttribute("selected", "");
		else this.removeAttribute("selected");
	}
}
export default Segment;
