import { Cell } from "src/ui/components";
import './sound-inspector-cell.scss';

type Sound = {
	id: number
	file: string
}

class SoundInspectorCell extends Cell<Sound> {
	public static readonly TagName: string = "wf-sound-inspector-cell";
	public static readonly observedAttributes: string[] = [];


	connectedCallback() {
		const id = document.createElement("span");
		id.textContent = `${this.data.id}`;
		this.appendChild(id);

		const file = document.createElement("span");
		file.textContent = `${this.data.file}`;
		this.appendChild(file);
	}
}

export default SoundInspectorCell;
