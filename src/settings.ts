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
			url: {
				"yoda": {
					data: process.env["YODA_DATA"] ?? "./game-data/yoda.en.data",
					palette: process.env["YODA_PALETTE"] ?? "./game-data/yoda.pal",
					sfx: process.env["YODA_SFX"] ?? "./game-data/sfx-yoda",
					help: process.env["YODA_HELP"] ?? "./game-data/yoda.en.hlp",
					strings: process.env["YODA_STRINGS"] ?? "./game-data/yoda.strings.json"
				},
				"yoda-es": {
					data: "./game-data/yoda.es.data",
					palette: "./game-data/yoda.pal",
					sfx: "./game-data/sfx-yoda",
					help: "./game-data/yoda.es.hlp",
					strings: "./game-data/yoda.es.strings.json"
				},
				"yoda-de": {
					data: "./game-data/yoda.de.data",
					palette: "./game-data/yoda.pal",
					sfx: "./game-data/sfx-yoda",
					help: "./game-data/yoda.de.hlp",
					strings: "./game-data/yoda.de.strings.json"
				},
				"yoda-demo": {
					data: process.env["YODA_DEMO_DATA"] ?? "./game-data/yoda-demo.en.data",
					palette: process.env["YODA_PALETTE"] ?? "./game-data/yoda.pal",
					sfx: process.env["YODA_SFX"] ?? "./game-data/sfx-yoda",
					help: process.env["YODA_DEMO_HELP"] ?? "./game-data/yoda-demo.en.hlp",
					strings: process.env["YODA_STRINGS"] ?? "./game-data/yoda-demo.strings.json"
				},
				"indy": {
					data: process.env["INDY_DATA"] ?? "./game-data/indy.en.data",
					palette: process.env["INDY_PALETTE"] ?? "./game-data/indy.pal",
					sfx: process.env["INDY_SFX"] ?? "./game-data/sfx-indy",
					help: process.env["INDY_HELP"] ?? "./game-data/indy.en.hlp",
					strings: process.env["INDY_STRINGS"] ?? "./game-data/indy.strings.json"
				},
				"indy-es": {
					data: "./game-data/indy.es.data",
					palette: "./game-data/indy.pal",
					sfx: "./game-data/sfx-indy",
					help: "./game-data/indy.es.hlp",
					strings: "./game-data/indy.strings.json"
				},
				"indy-fr": {
					data: "./game-data/indy.fr.data",
					palette: "./game-data/indy.pal",
					sfx: "./game-data/sfx-indy",
					help: "./game-data/indy.fr.hlp",
					strings: "./game-data/indy.strings.json"
				},
				"indy-demo": {
					data: "./game-data/indy-demo.en.data",
					palette: "./game-data/indy.pal",
					sfx: "./game-data/sfx-indy",
					help: "./game-data/indy-demo.en.hlp",
					strings: "./game-data/indy.strings.json"
				},
				"the-construct": {
					data: process.env["THE_CONSTRUCT_DATA"] ?? "./game-data/construct.data",
					palette: process.env["YODA_PALETTE"] ?? "./game-data/yoda.pal",
					sfx: process.env["INDY_SFX"] ?? "./game-data/sfx-indy",
					strings: process.env["INDY_STRINGS"] ?? "./game-data/indy.strings.json"
				}
			},
			// app state
			debuggerActive: false
		},
		"settings",
		localStorage
	)
);

export default Settings;
