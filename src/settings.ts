import { LogLevel, persistent } from "src/util";

let Settings = {
	AllowWebGL: false,

	debug: true,
	debugWorldGeneration: false,
	debugActions: false,

	drawDebugStats: true,
	drawHotspots: true,
	drawHeroTile: true,
	identifyTranslucentScenes: true,
	skipDialogs: true,

	autostartEngine: true,
	revealWorld: true,

	logLevel: LogLevel.Debug,

	url: {
		data: "./game-data/yoda.data",
		palette: "./game-data/yoda.pal",
		sfx: (file: string) => `./game-data/sfx-yoda/${encodeURIComponent(file)}.wav`
	}
};

export const loadSettings = () => Settings = persistent(Settings, "settings");
export default Settings;
