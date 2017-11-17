import AST from "./ast";
import Symbol from "./symbol";

class Printer {
	print(action: AST): string {
		if (typeof action === "boolean") {
			return action ? "T" : "NIL";
		}

		if (typeof action === "number") {
			return `${action}`;
		}

		if (action instanceof Symbol) {
			return action.name;
		}

		if (typeof action === "string") {
			return JSON.stringify(action);
		}

		if (action instanceof Array && action.length === 0) {
			return "[]";
		}

		if (action instanceof Array) {
			return "(" + action.map(i => this.print(i)).join(" ") + ")";
		}

		console.assert(false, "Unknown type encountered");
	}
}

export default Printer;
