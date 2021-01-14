import "./editor-window.scss";

import { AbstractWindow, ProgressIndicator } from "src/ui/components";
import { ColorPalette, GameData, AssetManager } from "src/engine";
import { DataProvider, PaletteProvider } from "src/app/editor/data";
import { Reader as SaveGameReaderFactory, SaveState } from "src/engine/save-game";
import { Tile, Zone, Puzzle, Char, Sound } from "src/engine/objects";

import EditorView from "./editor-view";
import { InputStream, PrefixedStorage } from "src/util";

class EditorWindow extends AbstractWindow {
	static readonly tagName = "wf-save-game-editor-window";
	title: string = "Save Game Editor";
	private _progressIndicator: HTMLElement = (<ProgressIndicator />);
	private _editorView: EditorView = (
		<EditorView storage={new PrefixedStorage(localStorage, "save-game-editor")} />
	) as EditorView;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.content.appendChild(this._progressIndicator);
	}

	public async loadGameFromStream(stream: InputStream) {
		if (!this._progressIndicator.parentElement) {
			this.textContent = "";
			this.content.appendChild(this._progressIndicator);
		}

		try {
			const { type, read } = SaveGameReaderFactory.build(stream);
			const gameData = await new DataProvider().provide(type);
			const palette = await new PaletteProvider().provide(type);

			const assets = new AssetManager();
			assets.populate(Zone, gameData.zones);
			assets.populate(Tile, gameData.tiles);
			assets.populate(Puzzle, gameData.puzzles);
			assets.populate(Char, gameData.characters);
			assets.populate(Sound, gameData.sounds);
			const saveGame = read(assets);

			this.presentSaveGame(saveGame, gameData, palette);
		} catch (e) {
			console.warn(e);
		}
	}

	public presentSaveGame(saveGame: SaveState, gameData: GameData, palette: ColorPalette) {
		this._progressIndicator.remove();
		this._editorView.presentState(saveGame, gameData, palette);
		this.content.appendChild(this._editorView);
	}
}

export default EditorWindow;
