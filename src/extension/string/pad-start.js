const padStart = function (length, character) {
	if (character === undefined || character === null) {
		character = " ";
	}
	let result = this;
	while (result.length < length) {
		result = character + result;
	}
	return result;
};

String.prototype.padStart = String.prototype.padStart || padStart;
export default padStart;
