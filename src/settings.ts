import { LogLevel, persistent, observable } from "src/util";
import * as SmartPhone from "detect-mobile-browser";

const Settings = observable(
	persistent(
		{
			mobile: SmartPhone(false).isAndroid() || SmartPhone(false).isIPhone(),
			pwa: new URLSearchParams(window.location.search).get("source") === "pwa",
			debug: true,

			drawDebugStats: false,
			drawHotspots: false,
			drawHeroTile: false,
			drawMonsterState: false,
			skipDialogs: false,
			skipTransitions: false,
			skipWinScene: false,
			pickupItemsAutomatically: false,
			lookTowardsMouse: true,
			autosaveTestOnZoneChange: true,

			autostartEngine: true,
			revealWorld: false,

			playEffects: false,
			playMusic: false,

			difficulty: 50,

			logLevel: LogLevel.Debug,

			issueTracker: "https://github.com/cyco/WebFun/issues/new",

			debuggerActive: false
		},
		"settings",
		localStorage
	)
);

export default Settings;
