export const Settings = {
	debug: false,
	debugWorldGeneration: false,
	debugActions: false,

	drawHotspots: true,
	drawHeroTile: true,
	identifyTranslucentScenes: true,
//	skipDialogs: true,

	autostartEngine: true,

	url: {
		data: "./game-data/yoda.data",
		palette: "./game-data/yoda.pal",
		sfx: (file) => `./game-data/sfx-yoda/${encodeURIComponent(file)}.wav`
	}
};
export default Settings;
