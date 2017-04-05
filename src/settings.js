export const Settings = {
	debug: false,

	drawHotspots: true,
	drawHeroTile: false,
	skipDialogs: true,

	autostartEngine: false,

	url: {
		data: "./game-data/yoda.data",
		palette: "./game-data/yoda.pal",
		sfx: (file) => `./game-data/sfx-yoda/${encodeURIComponent(file)}.wav`
	}


};
export default Settings;
