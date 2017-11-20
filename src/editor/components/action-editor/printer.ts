import AST, { default as ASTValue } from "./ast";
import Symbol from "./symbol";
import TaggedLineBuffer from "src/editor/components/action-editor/tagged-line-buffer";

const Keywords = ["defn", "and", "progn"];

class Printer {
	public indent = 4;
	private _buffer: TaggedLineBuffer;

	pprint(action: AST): string {
		this._buffer = new TaggedLineBuffer();

		this.putSimple(action, 0);
		this._buffer.endLine();

		return this._buffer.string;
	}

	private putSimple(action: AST, indent: number) {
		const indentation = " ".repeat(indent);
		this._buffer.put(indentation);

		if (typeof action === "boolean") {
			this._buffer.put((action ? "T" : "NIL"), "boolean");
			return;
		}

		if (typeof action === "number") {
			this._buffer.put(`${action}`, "number");
			return;
		}

		if (typeof action === "string") {
			this._buffer.put(JSON.stringify(action), "string");
			return;
		}

		if (this.isKeyword(action)) {
			this._buffer.put((<Symbol>action).name, "keyword");
			return;
		}

		if (action instanceof Symbol) {
			this._buffer.put(action.name, "symbol");
			return;
		}

		if (action instanceof Array && action.length === 0) {
			this._buffer.put("[]");
			return;
		}

		if (action instanceof Array) {
			const fn = action.shift();
			let chopAfter = 0;
			let indent = 0;
			if (fn instanceof Symbol) {
				if (fn.name === "defn") {
					chopAfter = 3;
					indent = 2;
				}

				if (fn.name === "and") {
					chopAfter = 2;
				}

				if (fn.name === "progn") {
					chopAfter = 1;
					indent = 2;
				}
			}

			this.putList([fn, ...action], chopAfter, indent);
		}
	}

	private putList(action: Array<ASTValue>, unchopped: number = 0, indentation: number = 0) {
		this._buffer.put("(");

		const chop = unchopped !== 0;
		let indent = chop ? (this._buffer.currentLineLength + indentation) : 1;

		while (unchopped > 1) {
			this.putSimple(action.shift(), 0);
			this._buffer.put(" ");
			unchopped--;
		}

		if (chop && indentation === 0)
			indent = this._buffer.currentLineLength;

		this.putSimple(action.shift(), 0);
		if (chop) this._buffer.endLine();

		while (action.length) {
			this.putSimple(action.shift(), indent);
			if (chop && action.length) this._buffer.endLine();
		}

		this._buffer.put(")");
	}

	private isKeyword(symbol: AST): boolean {
		return symbol instanceof Symbol && Keywords.contains(symbol.name);
	}

	print(action: AST, indent: number = 0): string {
		if (typeof action === "boolean") {
			return action ? "T" : "NIL";
		}

		if (typeof action === "number") {
			return `${action}`;
		}

		if (typeof action === "string") {
			return JSON.stringify(action);
		}

		if (action instanceof Symbol) {
			return action.name;
		}

		if (action instanceof Array && action.length === 0) {
			return "[]" + "\n";
		}

		if (action instanceof Array) {
			return "(" + action.map(i => this.print(i, indent + this.indent)).join("\n" + " ".repeat(indent)) + ")";
		}

		console.assert(false, "Unknown type encountered");
	}
}

export default Printer;
