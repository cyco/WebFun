import AbstractInspector from "src/editor/inspectors/abstract-inspector";
import { List, IconButton } from "src/ui/components";
import { SoundInspectorCell } from "../components";
import ReferenceResolver from "src/editor/reference-resolver";
import { Sound } from "src/engine/objects";

class SoundInspector extends AbstractInspector {
	private _list: List<Sound>;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Sounds";
		this.window.autosaveName = "sound-inspector";
		this.window.style.width = "200px";
		this.window.content.style.height = "450px";
		this.window.content.style.flexDirection = "column";
		this.window.addTitlebarButton(
			<IconButton icon="plus" title="Add new sound" onclick={() => this.addSound()} />
		);

		this._list = (
			<List
				state={state.prefixedWith("list")}
				cell={
					(
						<SoundInspectorCell
							onrevealreferences={(e: CustomEvent) => this.revealReferences(e.detail.sound)}
							onchange={(e: CustomEvent) => this.renameSound(e.detail.sound, e.detail.label)}
							onremove={(e: CustomEvent) => this.removeSound(e.detail.sound)}
						/>
					) as SoundInspectorCell
				}
				searchDelegate={this}
			/>
		) as List<Sound>;
		this.window.content.appendChild(this._list);
	}

	public build() {
		this._list.items = this.data.currentData.sounds;
	}

	public addSound() {
		this.data.currentData.sounds.push(new Sound(this.data.currentData.sounds.length, "New Sound"));
		this.build();
	}

	public removeSound(sound: Sound) {
		const index = this._list.items.indexOf(sound);
		if (index === -1) return;
		if (!confirm(`Do you really want to delete sound ${sound.id} (${sound.file})`)) return;
		this.data.currentData.sounds.splice(index, 1);
		this.build();
	}

	public renameSound(sound: Sound, name: string) {
		const index = this._list.items.indexOf(sound);
		if (index === -1) return;
		this.data.currentData.sounds.splice(index, 1, new Sound(index, name));
		this.build();
	}

	private revealReferences(sound: Sound) {
		const resolver = new ReferenceResolver(this.data.currentData);
		const references = resolver.findReferencesTo(sound);
		console.log("references", references);
	}

	prepareListSearch(searchValue: string, _: List<Sound>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], item: Sound, _: SoundInspectorCell, __: List<Sound>): boolean {
		const string = item.id + " " + item.file;
		return searchValue.every(r => r.test(string));
	}
}

export default SoundInspector;
