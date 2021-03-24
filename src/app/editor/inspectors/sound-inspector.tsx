import { IconButton, List } from "src/ui/components";

import SoundInspectorCell from "../components/sound-inspector-cell";
import AbstractInspector from "src/app/editor/inspectors/abstract-inspector";
import { Resolver, Updater } from "src/app/editor/reference";
import { Sound } from "src/engine/objects";
import ServiceContainer from "../service-container";

class SoundInspector extends AbstractInspector {
	private readonly updater: Updater = this.di.get(Updater);
	private readonly resolver: Resolver = this.di.get(Resolver);
	private _list: List<Sound>;

	constructor(state: Storage, di: ServiceContainer) {
		super(state, di);

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

	public build(): void {
		this._list.items = this.data.currentData.sounds;
	}

	public addSound(): void {
		this.data.currentData.sounds.push(new Sound(this.data.currentData.sounds.length, "New Sound"));
		this.build();
	}

	public removeSound(sound: Sound): void {
		const index = this._list.items.indexOf(sound);
		if (index === -1) return;
		if (!confirm(`Do you really want to delete sound ${sound.id} (${sound.file})`)) return;
		this.updater.deleteItem(sound);
		this.build();
	}

	public renameSound(sound: Sound, name: string): void {
		const index = this._list.items.indexOf(sound);
		if (index === -1) return;
		this.data.currentData.sounds.splice(index, 1, new Sound(index, name));
		this.build();
	}

	private revealReferences(sound: Sound) {
		const references = this.resolver.find(sound);
		console.log("references", references);
	}

	prepareListSearch(searchValue: string, _: List<Sound>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(
		searchValue: RegExp[],
		item: Sound,
		_: SoundInspectorCell,
		__: List<Sound>
	): boolean {
		const string = item.id + " " + item.file;
		return searchValue.every(r => r.test(string));
	}
}

export default SoundInspector;
