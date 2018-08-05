import AbstractInspector from "./abstract-inspector";
import { IconButton } from "src/ui/components";
import { EditorView } from "src/save-game-editor";
import { Writer } from "src/engine/save-game";
import { download, OutputStream, DiscardingOutputStream } from "src/util";
import "./save-game-inspector.scss";

class SaveGameInspector extends AbstractInspector {
	private _editorView: EditorView = <EditorView /> as EditorView;

	constructor(state: Storage) {
		super(state);

		this.window.title = "SaveGame Inspector";
		this.window.autosaveName = "save-game-inspector";
		this.window.content.style.flexDirection = "column";
		this.window.classList.add("wf-resource-editor-save-game-inspector");
		this.window.addTitlebarButton(
			<IconButton icon="download" onclick={() => this.saveGame()} />
		);
	}

	build() {
		this._editorView.presentState(this.data.state, this.data.currentData, this.data.palette);
		this.window.content.appendChild(this._editorView);
	}

	public saveGame(): void {
		const state = this._editorView.saveGame;
		const writer = new Writer(this._editorView.data);

		const countingStream = new DiscardingOutputStream();
		writer.write(state, countingStream);
		const stream = new OutputStream(countingStream.offset);
		writer.write(state, stream);

		download(stream.buffer, "savegame.wld");
	}
}

export default SaveGameInspector;
