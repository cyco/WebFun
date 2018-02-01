import { Window } from 'src/ui/components';
import { SaveGameReader, SaveState } from 'src/engine/save-game';
import { InputStream } from 'src/util';
import DataManager from 'src/editor/data-manager';
import { Planet, WorldSize } from 'src/engine/types';
import "./save-game-editor.scss";

class SaveGameEditor extends Window {
	public static TagName: string = 'wf-save-game-editor';
	public gameDataManager: DataManager;
	public file: File;
	private _label: Element = document.createElement('div');
	private _errors: Element = document.createElement('div');
	private _save: Element = document.createElement('div');

	constructor() {
		super();

		this.title = 'Save Game Editor';
		// this.autosaveName = "save-game-editor";
		this.closable = true;

		this._label.classList.add('label');
		this._errors.classList.add('errors');
		this._save.classList.add('save');

		this.content.appendChild(this._label);
		this.content.appendChild(this._errors);
		this.content.appendChild(this._save);
	}

	async connectedCallback() {
		super.connectedCallback();

		this._presentFile(this.file);
	}

	private async _presentFile(file: File) {
		this.title = file.name;
		const { save, error } = await this._loadFile(file);
		this._presentError(error);
		this._presentState(save);
	}

	private _presentFileName(name: string) {
		this._label.textContent = name;
	}

	private _presentError(error?: Error) {
		if (!error) {
			this._errors.textContent = '';
			return;
		}

		this._errors.textContent = error.message;
	}

	private _presentState(state: SaveState) {
		this._save.textContent = '';

		function* it(o: any) {
			var keys = Object.keys(o);
			for (var i = 0; i < keys.length; i++) {
				yield [keys[i], o[keys[i]]];
			}
		}

		for (var [key, value] of it(state)) {
			let row: Element = this._buildRow(key, value);
			if (row) this._save.appendChild(row);
		}
	}

	private _buildRow(key: string, value: any) {
		if (key === 'seed') {
			return this._buildTextboxRow(key, `0x${value.toString(0x10).padStart(4, 0)}`);
		}

		if (value instanceof WorldSize || value instanceof Planet) {
			return this._buildTextboxRow(key, value.name);
		}

		if (typeof value === 'number' || typeof value === 'string') {
			return this._buildTextboxRow(key, `${value}`);
		}

		if(value === null || value === undefined) {
			return this._buildTextboxRow(key, ``);
		}

		return null;
	}

	private _buildTextboxRow(text: string, value: string) {
		const row = document.createElement('div');
		const label = document.createElement('label');
		label.textContent = text;
		row.appendChild(label);

		const input = document.createElement('input');
		input.value = value;
		row.appendChild(input);

		return row;
	}

	private async _loadFile(file: File) {
		let stream: InputStream, reader: SaveGameReader, result: SaveState;
		try {
			stream = await file.provideInputStream();
			reader = new SaveGameReader(this.gameDataManager.currentData);
			return { save: await reader.read(stream), error: null };
		} catch (error) {
			return { error, save: reader.partialState };
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}
}

export default SaveGameEditor;
