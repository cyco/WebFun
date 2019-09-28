import { LogLevel } from "src/util";
import persistent from "src/util/persistent";

const Settings = persistent(
	{
		debug: true,

		drawDebugStats: true,
		drawHotspots: true,
		drawHeroTile: true,
		drawNPCState: true,
		skipDialogs: false,
		skipTransitions: false,
		pickupItemsAutomatically: false,

		autostartEngine: false,
		revealWorld: false,

		playEffects: false,
		playMusic: false,

		difficulty: 50,

		logLevel: LogLevel.Debug,

		url: {
			yoda: {
				data: "./game-data/yoda.data",
				palette: "./game-data/yoda.pal",
				sfx: "./game-data/sfx-yoda"
			},
			indy: {
				data: "./game-data/indy.data",
				palette: "./game-data/indy.pal",
				sfx: "./game-data/sfx-indy"
			}
		},
		// app state
		debuggerActive: false
	},
	"settings",
	localStorage
);

export default Settings;
