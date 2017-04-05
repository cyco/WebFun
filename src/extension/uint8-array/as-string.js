const asString = function() {
	return String.fromCharCode.apply(null, this);
};

Uint8Array.prototype.asString = asString;
export default asString;