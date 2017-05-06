import Breakpoint from './breakpoint';

export default class extends Breakpoint {
	constructor(symbolType, symbol) {
		super();

		this._symbolType = symbolType;
		this._symbol = symbol;
	}

	get id() {
		return `SYM:${this._symbolType}:${this._symbol}`;
	}
}
