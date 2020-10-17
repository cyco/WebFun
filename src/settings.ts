import { LogLevel } from "src/util";
import persistent from "src/util/persistent";
import * as SmartPhone from "detect-mobile-browser";

const Settings = persistent(
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
		url: {
			yoda: {
				data: process.env["YODA_DATA"] ?? "./game-data/yoda.data",
				palette: process.env["YODA_PALETTE"] ?? "./game-data/yoda.pal",
				sfx: process.env["YODA_SFX"] ?? "./game-data/sfx-yoda",
				help: process.env["YODA_HELP"] ?? "./game-data/yoda.hlp"
			},
			indy: {
				data: process.env["INDY_DATA"] ?? "./game-data/indy.data",
				palette: process.env["INDY_PALETTE"] ?? "./game-data/indy.pal",
				sfx: process.env["INDY_SFX"] ?? "./game-data/sfx-indy",
				help: process.env["YODA_HELP"] ?? "./game-data/indy.hlp"
			}
		},
		// app state
		debuggerActive: false
	},
	"settings",
	localStorage
);

export default Settings;
