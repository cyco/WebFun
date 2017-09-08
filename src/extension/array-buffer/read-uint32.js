const readUint32 = function (offset) {
	let buffer;
	if ((offset % Uint32Array.BYTES_PER_ELEMENT) !== 0)
		buffer = new Uint32Array(this.slice(offset, offset + Uint32Array.BYTES_PER_ELEMENT));
	else
		buffer = new Uint32Array(this, offset, 1);

	return buffer[0];
};

ArrayBuffer.prototype.readUint32 = ArrayBuffer.prototype.readUint32 || readUint32;

export default readUint32;
