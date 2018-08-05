import AbstractInspector from "src/editor/inspectors/abstract-inspector";
import { List } from "src/ui/components";
import { SoundInspectorCell } from "../components";
import ReferenceResolver from "src/editor/reference-resolver";

type Sound = {
	id: number;
	file: string;
};

class SoundInspector extends AbstractInspector {
	private _list: List<Sound>;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Sounds";
		this.window.autosaveName = "sound-inspector";
		this.window.style.width = "200px";
		this.window.content.style.height = "450px";
		this.window.content.style.flexDirection = "column";

		this._list = document.createElement(List.tagName) as List<Sound>;
		this._list.cell = document.createElement(SoundInspectorCell.tagName) as SoundInspectorCell;
		this._list.searchDelegate = this;
		this._list.state = state.prefixedWith("list");
		this._list.addEventListener(SoundInspectorCell.Events.RevealReferences, (e: CustomEvent) =>
			this._revealReferences(e.detail.sound)
		);
		this.window.content.appendChild(this._list);
	}

	build() {
		this._list.items = this.data.currentData.sounds.map(
			(name: string, index: number): Sound => ({
				id: index,
				file: name
			})
		);
	}

	prepareListSearch(searchValue: string, _: List<Sound>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(
		searchValue: RegExp[],
		item: Sound,
		cell: SoundInspectorCell,
		list: List<Sound>
	): boolean {
		const string = item.id + " " + item.file;
		return searchValue.every(r => r.test(string));
	}

	private _revealReferences(sound: string) {
		const resolver = new ReferenceResolver(this.data.currentData);
		const references = resolver.findReferencesTo(sound);
		console.log("references", references);
	}
}

export default SoundInspector;
