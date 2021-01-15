class Scanner {
	private _string: string;
	private _offset: number;

	constructor(string: string) {
		this._string = string;
		this._offset = 0;
	}

	public peek(): string {
		return this._string.charAt(this._offset);
	}

	public poke(): string {
		const result = this._string.charAt(this._offset);
		this._offset++;
		return result;
	}

	public skipWhitespace(): void {
		while (this.isAtWhitespace()) this.poke();
	}

	public isAtWhitespace(): boolean {
		const c = this.peek();

		if (c === " ") return true;
		if (c === "\t") return true;
		if (c === "\n") return true;
		if (c === "\r") return true;

		return false;
	}

	public isAtEnd(): boolean {
		return this._offset === this._string.length;
	}

	public get offset(): number {
		return this._offset;
	}

	public get rest(): string {
		return this._string.slice(this._offset);
	}
}

export default Scanner;
