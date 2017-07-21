export default class PersistentState {
	constructor() {
		Object.seal(this);
	}

	_getValue(key) {
		return 0 | localStorage.getItem(key);
	}

	_setValue(key, value) {
		localStorage.setItem(key, 0 | value);
	}

	get highScore() {
		return this._getValue("highScore") | 0;
	}

	set highScore(s) {
		this._setValue("highScore", 0 | s);
	}

	get lastScore() {
		return this._getValue("lastScore") | 0;
	}

	set lastScore(s) {
		this._setValue("lastScore", 0 | s);
	}

	get gamesWon() {
		return this._getValue("gamesWon") | 0;
	}

	set gamesWon(g) {
		this._setValue("gamesWon", 0 | g);
	}

	get gamesLost() {
		return this._getValue("gamesLost") | 0;
	}

	set gamesLost(g) {
		this._setValue("gamesLost", 0 | g);
	}
}
