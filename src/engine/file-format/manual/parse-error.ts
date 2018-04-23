class ParseError extends Error {
	constructor(message: string) {
		console.log("message: ", message);
		super(message);
	}

	toString() {
		return `<ParseError ${this.message}>`;
	}
}

export default ParseError;
