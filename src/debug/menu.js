import Settings from "src/settings";
import { MenuItemState } from "src/ui";
import ScriptDebugger from "./script-debugger";

const SettingsItem = (label, key) => ({
	title: label,
	callback: () => Settings[key] = !Settings[key],
	state: () => Settings[key] ? MenuItemState.On : MenuItemState.Off
});

const SettingsAction = (label, callback) => ({
	title: label,
	callback: callback
});

export default {
	title: "Debug",
	mnemonic: 0,
	submenu: [
		SettingsItem("Draw Debug Stats", "drawDebugStats"),
		SettingsItem("Draw invisible Hero", "drawHeroTile"),
		SettingsItem("Reveal World", "revealWorld"),
		SettingsItem("Show Hotspots", "drawHotspots"),
		SettingsItem("Skip Dialogs", "skipDialogs"),
		SettingsAction("Debug Scripts", () => ScriptDebugger.sharedDebugger.show())
	]
};
