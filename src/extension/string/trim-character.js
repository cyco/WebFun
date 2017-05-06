const trimCharacter = function(character = " ") {
	let result = this;
	while (~character.indexOf(result[0])) {
		result = result.slice(1);
	}
	while (~character.indexOf(result[result.length - 1])) {
		result = result.slice(0, -1);
	}
	return result;
};

String.prototype.trimCharacter = String.prototype.trimCharacter || trimCharacter;
export default trimCharacter;
