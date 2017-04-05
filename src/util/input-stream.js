import Stream from "./stream";

export default class InputStream extends Stream {
	constructor(data) {
		super();

		this.endianess = Stream.ENDIAN.LITTLE;
		this._arrayBuffer = this._makeArrayBuffer(data);
		this._dataView = new DataView(this._arrayBuffer);
	}

	_makeArrayBuffer(data) {
		if (data instanceof ArrayBuffer)
			return data;

		if (typeof data === "string") {
			let binaryString = atob(data);
			let len = binaryString.length;
			let bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++)
				bytes[i] = binaryString.charCodeAt(i);

			return bytes.buffer;
		}

		throw new TypeError();
	}

	get length() {
		return this._arrayBuffer.byteLength;
	}

	getCharacter() {
		return String.fromCharCode(this.getUint8());
	}

	getUint8() {
		const result = this._dataView.getUint8(this._offset);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
		return result;
	}

	getUint16() {
		const result = this._dataView.getUint16(this._offset, this.littleEndian);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
		return result;
	}

	getUint32() {
		const result = this._dataView.getUint32(this._offset, this.littleEndian);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
		return result;
	}

	getInt8() {
		const result = this._dataView.getInt8(this._offset);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
		return result;
	}

	getInt16() {
		const result = this._dataView.getInt16(this._offset, this.littleEndian);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
		return result;
	}

	getInt32() {
		const result = this._dataView.getInt32(this._offset, this.littleEndian);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
		return result;
	}

	getCharacters(length) {
		if (length === 0) return "";

		const characterCodes = new Uint8Array(this._arrayBuffer, this._offset, length);
		this._offset += length;
		return String.fromCharCode.apply(null, characterCodes);
	}

	getNullTerminatedString(maxLength) {
		const uint8Array = new Uint8Array(this._arrayBuffer, this._offset, maxLength);

		let length = -1;
		while (uint8Array[++length]);

		return this.getCharacters(length);
	}

	getLengthPrefixedString() {
		const length = this.getUint16();
		return this.getCharacters(length);
	}

	getUint8Array(length) {
		const result = new Uint8Array(this._arrayBuffer, this._offset, length);
		this._offset += length;
		return result;
	}

	getUint16Array(length) {
		let result;

		if (this._offset % 2 !== 0) {
			let buffer = this._arrayBuffer.slice(this._offset, this._offset + length * 2);
			result = new Uint16Array(buffer);
		} else {
			result = new Uint16Array(this._arrayBuffer, this._offset, length);
		}

		this._offset += length * 2;
		return result;
	}

	getUint32Array(length) {
		let result;

		if (this._offset % 4 !== 0) {
			let buffer = this._arrayBuffer.slice(this._offset, this._offset + length * 4);
			result = new Uint32Array(buffer);
		} else {
			result = new Uint32Array(this._arrayBuffer, this._offset, length);
		}

		this._offset += length * 4;
		return result;
	}

// // // // // // // // // // // // // // // // // //
}
