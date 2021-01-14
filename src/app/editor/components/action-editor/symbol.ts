class Symbol {
	private static symbols: { [name: string]: Symbol } = {};
	private _name: string;

	constructor(name: string) {
		if (Symbol.symbols[name]) return Symbol.symbols[name];

		this._name = name;
		Symbol.symbols[name] = this;
	}

	get name(): string {
		return this._name;
	}

	public toString(): string {
		return `Symbol(${this.name})`;
	}
}

export default Symbol;
