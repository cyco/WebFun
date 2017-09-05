import Editor from "src/editor";
import Settings from "src/settings";
import { MenuItemSeparator, MenuItemState } from "src/ui";

const SettingsItem = (label, key) => ({
	title: label,
	callback: () => Settings[key] = !Settings[key],
	state: () => Settings[key] ? MenuItemState.On : MenuItemState.Off
});

export default {
	title: "Debug",
	mnemonic: 0,
	submenu: [{
		title: "Start Game",
		callback: () => false,
		enabled: () => window.data
	}, {
		title: "Edit Data",
		callback: () => (new Editor(window.data)).show(),
		enabled: () => window.data
	}, {
		title: "Inspect Save Game",
		callback: () => false
	},
		MenuItemSeparator,
		SettingsItem("Draw invisible Hero", "drawHeroTile"),
		SettingsItem("Reveal World", "revealWorld"),
		SettingsItem("Show Hotspots", "drawHotspots"),
		SettingsItem("Skip Dialogs", "skipDialogs")
	]
};
