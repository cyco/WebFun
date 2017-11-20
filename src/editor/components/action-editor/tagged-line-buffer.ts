import LineBuffer from "src/editor/components/action-editor/line-buffer";

class TaggedLineBuffer extends LineBuffer {
	private _tagLines: string[] = [];
	private _currentTagLine: string = "";

	put(string: string, className?: string) {
		super.put(string);

		const parts = string.split("\n");
		while (parts.length) {
			const part = parts.shift();
			this._currentTagLine += className ? `<span class="${className}">${part.split(" ").join("&nbsp;")}</span>` : part;
			if (parts.length) this.endLine();
		}
	}

	endLine() {
		if (!this._currentLine.length) return;

		super.endLine();

		this._tagLines.push(this._currentTagLine);
		this._currentTagLine = "";
	}

	get string() {
		return this._tagLines.join("<br>");
	}
}

export default TaggedLineBuffer;
