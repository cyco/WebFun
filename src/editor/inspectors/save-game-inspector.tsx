import AbstractInspector from "./abstract-inspector";
import { List } from "src/ui/components";
import { EditorView } from "src/save-game-editor";
import "./save-game-inspector.scss";

class SaveGameInspector extends AbstractInspector {
	private _editorView: EditorView = <EditorView /> as EditorView;

	constructor(state: Storage) {
		super(state);

		this.window.title = "SaveGame Inspector";
		this.window.autosaveName = "save-game-inspector";
		this.window.content.style.flexDirection = "column";
		this.window.classList.add("wf-resource-editor-save-game-inspector");
	}

	build() {
		this._editorView.presentState(this.data.state, this.data.currentData, this.data.palette);
		this.window.content.appendChild(this._editorView);
	}
}

export default SaveGameInspector;
