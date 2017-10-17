class PersistentState {
	[_: string]: number|Storage|Function;
	private _storage: Storage;

	constructor(storage = localStorage) {
		this._storage = storage;
	}

	get highScore(): number {
		return this._getValue("highScore");
	}

	set highScore(s) {
		this._setValue("highScore", 0 | s);
	}

	get lastScore(): number {
		return this._getValue("lastScore");
	}

	set lastScore(s) {
		this._setValue("lastScore", 0 | s);
	}

	get gamesWon(): number {
		return this._getValue("gamesWon");
	}

	set gamesWon(g) {
		this._setValue("gamesWon", 0 | g);
	}

	get gamesLost(): number {
		return this._getValue("gamesLost");
	}

	set gamesLost(g) {
		this._setValue("gamesLost", 0 | g);
	}

	_getValue(key: string): number {
		return +this._storage.getItem(key);
	}

	_setValue(key: string, value: number): void {
		this._storage.setItem(key, "" + value);
	}
}

export default PersistentState;
