const trimCharacter = function (character = " "): string {
	let result = this.slice();
	while (~character.indexOf(result[0])) {
		result = result.slice(1);
	}
	while (~character.indexOf(result[result.length - 1])) {
		result = result.slice(0, -1);
	}
	return result;
};

String.prototype.trimCharacter = String.prototype.trimCharacter || trimCharacter;

declare global {
	interface String {
		trimCharacter(character?: string): string;
	}
}

export default trimCharacter;
