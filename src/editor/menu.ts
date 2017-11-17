import { MenuItemSeparator } from "src/ui";
import Editor from "src/editor/editor";

const SettingsAction = (label: string, callback: (() => void)) => ({
	title: label,
	callback: callback
});

export default {
	title: "Editor",
	mnemonic: 0,
	submenu: [
		SettingsAction("Tiles", (): void => Editor.sharedEditor.show("tile")),
		SettingsAction("Zones", (): void => Editor.sharedEditor.show("zone")),
		SettingsAction("Sound", (): void => Editor.sharedEditor.show("sound")),
		SettingsAction("Chars", (): void => Editor.sharedEditor.show("character")),
		SettingsAction("Puzzles", (): void => Editor.sharedEditor.show("puzzle")),
		SettingsAction("Sound", (): void => Editor.sharedEditor.show("sound")),
		SettingsAction("Setup Image", (): void => Editor.sharedEditor.show("setup-image")),
		SettingsAction("Palette", (): void => Editor.sharedEditor.show("palette")),
		MenuItemSeparator,
		SettingsAction("Load Data", (): void => (void Editor.sharedEditor.load())),
		SettingsAction("Save Data", (): void => Editor.sharedEditor.save())
	]
};
