import { LogLevel, persistent } from "src/util";

let Settings = {
	allowWebGL: false,

	debug: true,

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
		sfx: (file: string) => `./game-data/sfx-yoda/${encodeURIComponent(file)}.wav`
	},
	// app state
	debuggerActive: false
};

export const loadSettings = () => Settings = persistent(Settings, "settings");
export default Settings;
