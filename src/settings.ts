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
			yodaDemo: {
				data: process.env["YODA_DEMO_DATA"] ?? "./game-data/yoda-demo.data",
				palette: process.env["YODA_PALETTE"] ?? "./game-data/yoda.pal",
				sfx: process.env["YODA_SFX"] ?? "./game-data/sfx-yoda",
				help: process.env["YODA_DEMO_HELP"] ?? "./game-data/yoda-demo.hlp"
			},
			indy: {
				data: process.env["INDY_DATA"] ?? "./game-data/indy.data",
				palette: process.env["INDY_PALETTE"] ?? "./game-data/indy.pal",
				sfx: process.env["INDY_SFX"] ?? "./game-data/sfx-indy",
				help: process.env["YODA_HELP"] ?? "./game-data/indy.hlp"
			},
			indyDemo: {
				data: process.env["INDY_DEMO_DATA"] ?? "./game-data/indy-demo.data",
				palette: process.env["INDY_PALETTE"] ?? "./game-data/indy.pal",
				sfx: process.env["INDY_SFX"] ?? "./game-data/sfx-indy",
				help: process.env["YODA_DEMO_HELP"] ?? "./game-data/indy-demo.hlp"
			},
			theConstruct: {
				data: process.env["THE_CONSTRUCT_DATA"] ?? "./game-data/construct.data",
				palette: process.env["YODA_PALETTE"] ?? "./game-data/yoda.pal",
				sfx: process.env["YODA_SFX"] ?? "./game-data/sfx-yoda"
			}
		},
		// app state
		debuggerActive: false
	},
	"settings",
	localStorage
);

export default Settings;
