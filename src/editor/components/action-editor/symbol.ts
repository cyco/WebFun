class Symbol {
	private static symbols: { [name: string]: Symbol } = {};
	private _name: string;

	constructor(name: string) {
		if (Symbol.symbols[name]) return Symbol.symbols[name];

		this._name = name;
		Symbol.symbols[name] = this;
	}

	get name() {
		return this._name;
	}

	public toString() {
		return `Symbol(${this.name})`;
	}
}

export default Symbol;
