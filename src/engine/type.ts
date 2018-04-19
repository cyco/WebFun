class GameType {
	private _saveGameMagic: string;
	constructor(saveGameMagic: string) {
		this._saveGameMagic = saveGameMagic;
	}

	public get saveGameMagic() {
		return this._saveGameMagic;
	}
}

export const Indy = new GameType("INDYSAV44");
export const Yoda = new GameType("YODASAV44");
export { GameType };
