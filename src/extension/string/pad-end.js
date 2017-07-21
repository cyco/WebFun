const padEnd = function (length, character = " ") {
	let result = this;
	while (result.length < length) {
		result = result + character;
	}
	return result;
};

String.prototype.padEnd = String.prototype.padEnd || padEnd;
export default padEnd;
