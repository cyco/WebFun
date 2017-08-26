import { persistent } from "/util";

export const Settings = {
	debug: true,
	debugWorldGeneration: false,
	debugActions: true,

	drawHotspots: true,
	drawHeroTile: true,
	identifyTranslucentScenes: true,
	skipDialogs: false,

	autostartEngine: false,
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
