import { Window, ProgressIndicator } from "src/ui/components";
import { Reader as SaveGameReaderFactory, SaveState } from "src/engine/save-game";
import { GameData, ColorPalette } from "src/engine";
import { InputStream, PromiseProgress } from "src/util";
import { DataProvider, PaletteProvider } from "src/app/data";
import EditorView from "./editor-view";
import "./editor-window.scss";

class EditorWindow extends Window {
	static readonly TagName = "wf-save-game-editor-window";
	title: string = "Save Game Editor";
	private _progressIndicator: HTMLElement = <ProgressIndicator />;
	private _editorView: EditorView = <EditorView /> as EditorView;

	connectedCallback() {
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
			const saveGame = read(gameData);

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
