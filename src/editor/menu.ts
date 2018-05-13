import { MenuItemSeparator, MenuItemInit } from "src/ui";
import { Window } from "src/ui/components";
import EditorView from "src/editor/editor-view";

const SettingsAction = (label: string, callback: (() => void)) => ({
	title: label,
	callback: callback
});

export default (editor: EditorView, window: Window) =>
	[
		{
			title: "Editor",
			mnemonic: 0,
			submenu: [
				SettingsAction("Load Data", () => editor.load()),
				SettingsAction("Save Data", () => editor.save()),
				MenuItemSeparator,
				SettingsAction("Close", () => window.close())
			]
		},
		{
			title: "Views",
			mnemonic: 0,
			submenu: [
				SettingsAction("Tiles", () => editor.show("tile")),
				SettingsAction("Zones", () => editor.show("zone")),
				SettingsAction("Sound", () => editor.show("sound")),
				SettingsAction("Chars", () => editor.show("character")),
				SettingsAction("Puzzles", () => editor.show("puzzle")),
				SettingsAction("Sound", () => editor.show("sound")),
				SettingsAction("Setup Image", () => editor.show("setup-image")),
				SettingsAction("Palette", () => editor.show("palette"))
			]
		}
	] as MenuItemInit[];
