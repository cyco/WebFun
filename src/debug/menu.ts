import Settings from "src/settings";
import { MenuItemSeparator, MenuItemState } from "src/ui";
import ScriptDebugger from "./script-debugger";

const SettingsItem = (label: string, key: string) => ({
	title: label,
	callback: () => (<any>Settings)[key] = !(<any>Settings)[key],
	state: () => (<any>Settings)[key] ? MenuItemState.On : MenuItemState.Off
});

const SettingsAction = (label: string, callback: Function) => ({
	title: label,
	callback: callback
});

export default {
	title: "Debug",
	mnemonic: 0,
	submenu: [
		{
			title: "Settings",
			mnemonic: 0,
			submenu: [
				SettingsItem("Draw Debug Stats", "drawDebugStats"),
				SettingsItem("Draw invisible Hero", "drawHeroTile"),
				SettingsItem("Reveal World", "revealWorld"),
				SettingsItem("Show Hotspots", "drawHotspots"),
				SettingsItem("Skip Dialogs", "skipDialogs")
			]
		},
		MenuItemSeparator,
		SettingsAction("Debug Scripts", () => ScriptDebugger.sharedDebugger.show())
	]
};
