import { Window } from 'src/ui/components';
import DataManager from 'src/editor/data-manager';
import { SaveGameReader } from 'src/engine/save-game';
import "./save-game-editor.scss";

class SaveGameEditor extends Window {
	public static TagName: string = 'wf-save-game-editor';
	public gameDataManager: DataManager;
	public file: File;
	private _label: Element = document.createElement('div');

	constructor() {
		super();

		this.title = 'Save Game Editor';
		this.autosaveName = "save-game-editor";
		this.closable = true;

		this.content.appendChild(this._label);
	}

	connectedCallback() {
		super.connectedCallback();
		this._label.textContent = this.file.name;
		this._loadFile();
	}

	private async _loadFile() {
		try {
			const stream = await this.file.provideInputStream();
			const reader = new SaveGameReader(this.gameDataManager.currentData);
			const result = await reader.read(stream);
			console.log('result: ', result);
		} catch (e) {
			console.error(e);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}
}

export default SaveGameEditor;
