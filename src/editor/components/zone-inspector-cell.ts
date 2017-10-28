import { Cell } from "src/ui/components";
import { Zone } from "src/engine/objects";
import "./zone-inspector-cell.scss";

class ZoneInspectorCell extends Cell<Zone> {
	public static readonly TagName: string = "wf-zone-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	private _id = document.createElement("span");

	connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this.appendChild(this._id);
	}
}

export default ZoneInspectorCell;
