const padEnd = function (length: number, character: string = " "): string {
	let result = this;
	while (result.length < length) {
		result = result + character;
	}
	return result;
};

String.prototype.padEnd = String.prototype.padEnd || padEnd;

declare global {
	interface String {
		padEnd(length: number, character?: string): string;
	}
}

export default padEnd;
