import Syntax from "./syntax";

function parse(input: string): string[] {
	if (!input.length) return [];

	const result: string[] = [];
	for (let i = 0; i < input.length; i++) {
		let char = input[i];
		switch (char) {
			case " ":
			case "\n":
				continue;
			case Syntax.Comment: {
				let comment = Syntax.Comment;
				for (i += 1; i < input.length; i++) {
					char = input[i];
					if (char === "\n") break;
					comment += char;
				}
				result.push(comment);
				break;
			}
			case Syntax.Attack[0]:
			case Syntax.Place.Start[0]:
				if (input[i + 1] === Syntax.Attack[1]) {
					result.push(Syntax.Attack);
					i += Syntax.Attack.length;
					break;
				} else {
					result.push(Syntax.Place.Start);
					i += Syntax.Place.Start.length + 1;

					let item = "";
					for (i; i < input.length; i++) {
						char = input[i];
						if (char === " ") break;
						item += char;
					}
					result.push(item);

					i += 1;
					if (input[i] === "a" && input[i + 1] === "t") {
						result.push("at");
						i += 3;
					}

					let place = "";
					for (i; i < input.length; i++) {
						char = input[i];
						if (char === " ") break;
						place += char;
					}
					result.push(place);
				}
				break;
			default:
				result.push(char);
				break;
		}
	}

	return result;
}

function assemble(input: string[]): string {
	if (input.length === 0) return ".";

	let result = "";
	for (let i = 0; i < input.length; i++) {
		const currentInput = input[i];
		if (currentInput[0] === Syntax.Comment) {
			result = result.trim() + "\n" + currentInput + "\n";
		} else {
			result += currentInput + " ";
		}
	}

	return result;
}
export { parse, assemble };
