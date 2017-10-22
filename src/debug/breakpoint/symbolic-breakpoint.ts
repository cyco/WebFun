import Breakpoint from "./breakpoint";

class SymbolicBreakpoint extends Breakpoint {
	private _symbolType: any;
	private _symbol: any;

	constructor(symbolType: any, symbol: any) {
		super();

		this._symbolType = symbolType;
		this._symbol = symbol;
	}

	get id() {
		return `SYM:${this._symbolType}:${this._symbol}`;
	}
}
export default SymbolicBreakpoint;
