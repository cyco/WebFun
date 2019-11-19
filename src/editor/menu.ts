import { MenuItemInit, MenuItemSeparator } from "src/ui";

import EditorView from "src/editor/editor-view";
import { Window } from "src/ui/components";

const MenuItemAction = (label: string, callback: () => void, enabled: boolean | (() => boolean) = true) => ({
	title: label,
	callback: callback,
	enabled: enabled
});

export default (editor: EditorView, window: Window) =>
	[
		{
			title: "Editor",
			mnemonic: 0,
			submenu: [
				MenuItemAction("Load Data", () => editor.load()),
				MenuItemAction("Save Data", () => editor.save()),
				MenuItemAction("Load Save Game", () => editor.loadSaveGame()),
				MenuItemSeparator,
				MenuItemAction("Close", () => window.close())
			]
		},
		{
			title: "Views",
			mnemonic: 0,
			submenu: [
				MenuItemAction("Tiles", () => editor.show("tile")),
				MenuItemAction("Zones", () => editor.show("zone")),
				MenuItemAction("Sound", () => editor.show("sound")),
				MenuItemAction("Chars", () => editor.show("character")),
				MenuItemAction("Puzzles", () => editor.show("puzzle")),
				MenuItemAction("Sound", () => editor.show("sound")),
				MenuItemAction("Setup Image", () => editor.show("setup-image")),
				MenuItemAction("Palette", () => editor.show("palette")),
				MenuItemAction(
					"Save Game",
					() => editor.show("save-game"),
					() => !!editor.data.state
				),
				MenuItemAction("Coverage", () => editor.show("coverage"))
			]
		}
	] as MenuItemInit[];
