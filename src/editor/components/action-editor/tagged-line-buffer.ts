import LineBuffer from "src/editor/components/action-editor/line-buffer";

class TaggedLineBuffer extends LineBuffer {
	public tagName: string = "span";
	private _tagLines: string[] = [];
	private _currentTagLine: string = "";

	put(string: string, className?: string): void {
		super.put(string);

		const parts = string.split("\n");
		while (parts.length) {
			const part = parts.shift();
			this._currentTagLine += className
				? `<${this.tagName} class="${className}">${part.split(" ").join("&nbsp;")}</${
						this.tagName
				  }>`
				: part;
			if (parts.length) this.endLine();
		}
	}

	endLine(): void {
		if (!this._currentLine.length) return;

		super.endLine();

		this._tagLines.push(this._currentTagLine);
		this._currentTagLine = "";
	}

	get string(): string {
		return this._tagLines.join("<br>");
	}
}

export default TaggedLineBuffer;
