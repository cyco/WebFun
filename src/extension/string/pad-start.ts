const padStart = function(length: number, character: string = " "): string {
	let result = this.slice();
	while (result.length < length) {
		result = character + result;
	}
	return result;
};

String.prototype.padStart = String.prototype.padStart || padStart;

declare global {
	interface String {
		padStart(length: number, character?: string): string;
	}
}

export default padStart;
