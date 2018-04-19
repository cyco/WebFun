import { LogLevel, persistent } from "src/util";

let Settings: { [_: string]: any } = {
	allowWebGL: false,
	allowTileSheet: false,

	debug: true,
	editor: true,
	saveGameEditor: true,

	drawDebugStats: true,
	drawHotspots: true,
	drawHeroTile: true,
	skipDialogs: false,

	autostartEngine: true,
	revealWorld: false,

	logLevel: LogLevel.Debug,

	url: {
		data: "./game-data/yoda.data",
		palette: "./game-data/yoda.pal",
		sfx: (file: string) => `./game-data/sfx-yoda/${encodeURIComponent(file)}`,

		yoda: {
			data: "./game-data/yoda.data",
			palette: "./game-data/yoda.pal"
		},

		indy: {
			data: "./game-data/indy.data",
			palette: "./game-data/indy.pal"
		}
	},
	// app state
	debuggerActive: false
};

export const loadSettings = () => (Settings = persistent(Settings, "settings"));
export default Settings;
