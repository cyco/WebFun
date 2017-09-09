import { persistent } from "src/util";

export const Settings = {
	AllowWebGL: false,

	debug: true,
	debugWorldGeneration: false,
	debugActions: false,

	drawHotspots: true,
	drawHeroTile: true,
	identifyTranslucentScenes: true,
	skipDialogs: true,

	autostartEngine: true,
	revealWorld: true,

	url: {
		data: "./game-data/yoda.data",
		palette: "./game-data/yoda.pal",
		sfx: (file) => `./game-data/sfx-yoda/${encodeURIComponent(file)}.wav`
	}
};

export default persistent(Settings, "settings");
