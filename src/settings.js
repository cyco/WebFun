import { persistent } from "src/util";

export const Settings = {
	debug: true,
	debugWorldGeneration: false,
	debugActions: false,

	drawHotspots: true,
	drawHeroTile: true,
	identifyTranslucentScenes: true,
	skipDialogs: false,

	autostartEngine: true,
	revealWorld: true,

	url: {
		data: "./game-data/yoda.data",
		palette: "./game-data/yoda.pal",
		sfx: (file) => `./game-data/sfx-yoda/${encodeURIComponent(file)}.wav`
	}
};
const s = persistent(Settings, "settings");
window.s = s;
export default s;
