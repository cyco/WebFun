const readUint8 = function (offset) {
	let buffer = new Uint8Array(this, offset, Uint8Array.BYTES_PER_ELEMENT);
	return buffer[ 0 ];
};

ArrayBuffer.prototype.readUint8 = ArrayBuffer.prototype.readUint8 || readUint8;

export default readUint8;
