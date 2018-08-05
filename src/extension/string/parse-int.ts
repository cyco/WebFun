function parseInteger(): number {
	if (/^0x/i.test(this)) {
		return parseInt(this.substr(2), 0x10);
	}

	if (/^0b/i.test(this)) {
		return parseInt(this.substr(2), 2);
	}

	return parseInt(this);
}

String.prototype.parseInt = String.prototype.parseInt || parseInteger;

declare global {
	interface String {
		parseInt(): number;
	}
}

export default parseInteger;
