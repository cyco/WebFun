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
};

export const loadSettings = () => (Settings = persistent(Settings, "settings"));
export default Settings;
