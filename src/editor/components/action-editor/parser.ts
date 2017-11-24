import AST, { s } from "./ast";
import { Scanner } from "src/util";
import Symbol from "./symbol";

class ParserError extends Error {
}

class Parser {
	public parse(input: string): AST[] {
		let scanner = new Scanner(input);

		const tokens = [];
		while (!scanner.isAtEnd()) {
			const token = this.read(scanner);
			if (!token) {
				continue;
			}

			tokens.push(token);
		}

		return tokens;
	}

	private read(scanner: Scanner): AST {
		scanner.skipWhitespace();

		const c = scanner.peek();
		if (c === "\"") return this.readString(scanner);
		if (c === "-" || /\d/.test(c)) return this.readNumber(scanner);
		if (c === "(") return this.readList(scanner);
		if (c === "[") return this.readArray(scanner);

		return this.readSymbol(scanner);
	}

	private readString(scanner: Scanner): string {
		let c, result = "", startingOffset = scanner.offset;

		scanner.poke();

		do {
			c = scanner.poke();
			if (c === "\"") break;
			if (!c) throw new ParserError(`Unterminated string, starting at ${startingOffset}.`);

			if (c === "\\") {
				c = this.escapedCharacter(scanner.poke());
			}

			result += c;
		} while (true);

		return result;
	}

	private escapedCharacter(c: string): string {
		if (c === "t") return "\t";
		if (c === "r") return "\r";
		if (c === "n") return "\n";
		if (c === "\"") return "\"";

		throw new ParserError(`Invalid escape sequence \\${c} encountered`);
	}

	private readNumber(scanner: Scanner): number {
		let c, result = "", startingOffset = scanner.offset;
		let factor = 1;

		c = scanner.peek();
		if (c === "-" || c === "+") {
			scanner.poke();
			factor = c === "-" ? -1 : 1;
		}

		do {
			if (scanner.isAtWhitespace()) break;

			c = scanner.peek();
			if (c === "(" || c === ")") break;

			c = scanner.poke();
			if (!/\d/.test(c)) throw new ParserError(`Invalid number starting at ${startingOffset}.`);

			result += c;
		} while (true);

		return parseInt(result) * factor;
	}

	private readList(scanner: Scanner): AST[] {
		let c, result: AST[] = [], startingOffset = scanner.offset;

		scanner.poke();

		do {
			scanner.skipWhitespace();
			c = scanner.peek();
			if (!c) throw new ParserError(`Unterminated list starting at ${startingOffset}.`);
			if (c === ")") {
				scanner.poke();
				break;
			}

			result.push(this.read(scanner));
		} while (true);

		return result;
	}

	private readArray(scanner: Scanner): AST[] {
		let c, result: AST[] = [], startingOffset = scanner.offset;
		scanner.poke();

		do {
			scanner.skipWhitespace();
			c = scanner.peek();
			if (!c) throw new ParserError(`Unterminated list starting at ${startingOffset}.`);
			if (c === "]") {
				scanner.poke();
				break;
			}

			const token = this.read(scanner);
			result.push(token);
		} while (true);

		return result;
	}

	private readSymbol(scanner: Scanner): Symbol|boolean {
		let c, name: string = "", startingOffset = scanner.offset;

		do {
			c = scanner.peek();
			if (c === "(" || c === ")" || c === "[" || c === "]") break;
			if (scanner.isAtWhitespace()) break;
			if (scanner.isAtEnd()) break;

			name += scanner.poke();
		} while (true);

		if (name.length === 0) throw new ParserError(`Expected symbol staring at ${startingOffset}.`);

		if (name.toLowerCase() === "nil") {
			return false;
		}
		if (name.toLowerCase() === "t") {
			return true;
		}

		return s`${name}`;
	}
}

export default Parser;
export { ParserError };
