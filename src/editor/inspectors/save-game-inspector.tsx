import AbstractInspector from "./abstract-inspector";
import { IconButton } from "src/ui/components";
import { EditorView } from "src/save-game-editor";
import { Writer } from "src/engine/save-game";
import { Story } from "src/engine";
import { download, OutputStream, DiscardingOutputStream } from "src/util";
import GameController from "src/app/game-controller";
import { Planet, WorldSize } from "src/engine/types";
import "./save-game-inspector.scss";

class SaveGameInspector extends AbstractInspector {
	private _editorView: EditorView = (
		<EditorView state={this.state.prefixedWith("editor-view")} />
	) as EditorView;

	constructor(state: Storage) {
		super(state);

		this.window.title = "SaveGame Inspector";
		this.window.autosaveName = "save-game-inspector";
		this.window.content.style.flexDirection = "column";
		this.window.classList.add("wf-resource-editor-save-game-inspector");
		this.window.addTitlebarButton(
			<IconButton
				icon="download"
				title="Download modified save game"
				onclick={() => this.downloadSaveGame()}
			/>
		);
		this.window.addTitlebarButton(
			<IconButton
				icon="play"
				title="Load and play this save game"
				onclick={() => this.playSaveGame()}
			/>
		);
	}

	build() {
		this._editorView.presentState(this.data.state, this.data.currentData, this.data.palette);
		this.window.content.appendChild(this._editorView);
	}

	public downloadSaveGame(): void {
		const state = this._editorView.saveGame;
		const writer = new Writer(this._editorView.data);

		const countingStream = new DiscardingOutputStream();
		writer.write(state, countingStream);
		const stream = new OutputStream(countingStream.offset);
		writer.write(state, stream);

		download(stream.buffer, "savegame.wld");
	}

	public playSaveGame(): void {
		const controller = new GameController();
		controller.windowManager = this.window.manager;
		controller.data = this.data.currentData.copy();
		controller.palette = new Uint8Array(this.data.palette);

		const state = this.data.state;
		const story = new Story(state.seed, state.planet, state.worldSize);
		controller.start(story);
	}
}

export default SaveGameInspector;
