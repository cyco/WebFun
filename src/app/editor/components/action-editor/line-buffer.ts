class LineBuffer {
	protected _lines: string[] = [];
	protected _currentLine: string = "";

	put(string: string, ..._rest: any[]): void {
		const parts = string.split("\n");
		while (parts.length) {
			this._currentLine += parts.shift();
			if (parts.length) this.endLine();
		}
	}

	endLine(): void {
		if (!this._currentLine.length) return;

		this._lines.push(this._currentLine);
		this._currentLine = "";
	}

	get currentLineLength(): number {
		return this._currentLine.length;
	}

	get string(): string {
		return this._lines.join("\n");
	}
}

export default LineBuffer;
