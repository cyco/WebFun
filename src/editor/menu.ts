import { MenuItemSeparator } from "src/ui";
import EditorView from "src/editor/editor-view";

const SettingsAction = (label: string, callback: (() => void)) => ({
	title: label,
	callback: callback
});

export default (editor: EditorView) => [
	{
		title: "Editor",
		mnemonic: 0,
		submenu: [
			SettingsAction("Load Data", () => editor.load()),
			SettingsAction("Save Data", () => editor.save()),
			MenuItemSeparator,
			SettingsAction("Close", () => editor.remove())
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
];
