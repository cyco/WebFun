export const Settings = {
	debug: true,
	debugWorldGeneration: false,
	debugActions: true,

	drawHotspots: true,
	drawHeroTile: true,
	identifyTranslucentScenes: true,
//	skipDialogs: true,

	autostartEngine: false,
	revealWorld: true,

	url: {
		data: "./game-data/yoda.data",
		palette: "./game-data/yoda.pal",
		sfx: (file) => `./game-data/sfx-yoda/${encodeURIComponent(file)}.wav`
	}
};
export default Settings;
