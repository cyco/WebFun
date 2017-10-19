import { persistent } from "src/util";

const Settings = {
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
		sfx: (file: string) => `./game-data/sfx-yoda/${encodeURIComponent(file)}.wav`
	}
};

export { Settings };
export default persistent(Settings, "settings");
