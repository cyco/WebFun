import { MenuItemSeparator } from "src/ui";

const SettingsAction = (label: string, callback: Function) => ({
	title: label,
	callback: callback
});

export default {
	title: "Editor",
	mnemonic: 0,
	submenu: [
		SettingsAction("Tiles", (): void => null),
		SettingsAction("Zones", (): void => null),
		SettingsAction("Items", (): void => null),
		SettingsAction("Sound", (): void => null),
		SettingsAction("Chars", (): void => null),
		SettingsAction("Puzzles", (): void => null),
		SettingsAction("Sound", (): void => null),
		SettingsAction("Setup Image", (): void => null),
		MenuItemSeparator,
		SettingsAction("Load Data", (): void => null),
		SettingsAction("Save Data", (): void => null)
	]
};
