import AbstractInspector from "src/editor/inspectors/abstract-inspector";
import { List } from "src/ui/components";
import { SoundInspectorCell } from "../components";

type Sound = {
	id: number
	file: string
}

class SoundInspector extends AbstractInspector {
	private _list: List<Sound>;

	constructor() {
		super();

		this.window.title = "Sounds";
		this.window.autosaveName = "sound-inspector";
		this.window.style.width = "200px";
		this.window.content.style.height = "450px";
		this.window.content.style.flexDirection = "column";

		this._list = <List<Sound>>document.createElement(List.TagName);
		this._list.classList.add("sound-inspector-list");
		this._list.cell = <SoundInspectorCell>document.createElement(SoundInspectorCell.TagName);
		this._list.searchDelegate = this;

		this.window.content.appendChild(this._list);
	}

	build() {
		this._list.items = this.data.currentData.sounds.map((name: string, index: number): Sound => ({
			id: index,
			file: name
		}));
	}

	prepareListSearch(searchValue: string, list: List<Sound>): RegExp[] {
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], item: Sound, cell: SoundInspectorCell, list: List<Sound>): boolean {
		const string = item.id + " " + item.file;
		return searchValue.every(r => r.test(string));
	}
}

export default SoundInspector;
