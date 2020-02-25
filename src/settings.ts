import { LogLevel } from "src/util";
import persistent from "src/util/persistent";

const Settings = persistent(
	{
		mobile: false,
		debug: true,

		drawDebugStats: true,
		drawHotspots: true,
		drawHeroTile: true,
		drawMonsterState: true,
		skipDialogs: false,
		skipTransitions: false,
		skipWinScene: false,
		pickupItemsAutomatically: false,
		lookTowardsMouse: false,
		autosaveTestOnZoneChange: true,

		autostartEngine: true,
		revealWorld: false,

		playEffects: false,
		playMusic: false,

		difficulty: 50,

		logLevel: LogLevel.Debug,

		url: {
			yoda: {
				data: process.env["YODA_DATA"] ?? "./game-data/yoda.data",
				palette: process.env["YODA_PALETTE"] ?? "./game-data/yoda.pal",
				sfx: process.env["YODA_SFX"] ?? "./game-data/sfx-yoda"
			},
			indy: {
				data: process.env["INDY_DATA"] ?? "./game-data/indy.data",
				palette: process.env["INDY_PALETTE"] ?? "./game-data/indy.pal",
				sfx: process.env["INDY_SFX"] ?? "./game-data/sfx-indy"
			}
		},
		// app state
		debuggerActive: false
	},
	"settings",
	localStorage
);

export default Settings;
