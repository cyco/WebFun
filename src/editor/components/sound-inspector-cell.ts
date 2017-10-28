import { Cell } from "src/ui/components";
import "./sound-inspector-cell.scss";

type Sound = {
	id: number
	file: string
}

class SoundInspectorCell extends Cell<Sound> {
	public static readonly TagName: string = "wf-sound-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	private _id = document.createElement("span");
	private _file = document.createElement("span");

	connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this.appendChild(this._id);

		this._file.textContent = `${this.data.file}`;
		this.appendChild(this._file);
	}
}

export default SoundInspectorCell;
