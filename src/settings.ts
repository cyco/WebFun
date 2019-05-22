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

		autostartEngine: true,
		revealWorld: false,

		playSound: false,
		playMusic: false,

		logLevel: LogLevel.Debug,

		url: {
			yoda: {
				data: "./game-data/yoda.data",
				palette: "./game-data/yoda.pal",
				sfx: (file: string) => `./game-data/sfx-yoda/${encodeURIComponent(file)}`
			},
			indy: {
				data: "./game-data/indy.data",
				palette: "./game-data/indy.pal",
				sfx: (file: string) => `./game-data/sfx-indy/${encodeURIComponent(file)}`
			}
		},
		// app state
		debuggerActive: false
	},
	"settings",
	localStorage
);

export default Settings;
