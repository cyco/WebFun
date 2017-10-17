import Stream from "./stream";

class InputStream extends Stream {
	private _arrayBuffer: ArrayBuffer;
	private _dataView: DataView;

	constructor(data: ArrayBuffer|string) {
		super();

		this.endianess = Stream.ENDIAN.LITTLE;
		this._arrayBuffer = this._makeArrayBuffer(data);
		this._dataView = new DataView(this._arrayBuffer);
	}

	get length() {
		return this._arrayBuffer.byteLength;
	}

	_makeArrayBuffer(data: ArrayBuffer|string) {
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

	getCharacter(): string {
		return String.fromCharCode(this.getUint8());
	}

	getUint8(): number {
		const result = this._dataView.getUint8(this._offset);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
		return result;
	}

	getUint16(): number {
		const result = this._dataView.getUint16(this._offset, this.littleEndian);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
		return result;
	}

	getUint32(): number {
		const result = this._dataView.getUint32(this._offset, this.littleEndian);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
		return result;
	}

	getInt8(): number {
		const result = this._dataView.getInt8(this._offset);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
		return result;
	}

	getInt16(): number {
		const result = this._dataView.getInt16(this._offset, this.littleEndian);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
		return result;
	}

	getInt32(): number {
		const result = this._dataView.getInt32(this._offset, this.littleEndian);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
		return result;
	}

	getCharacters(length: number): string {
		if (length === 0) return "";

		const characterCodes = new Uint8Array(this._arrayBuffer, this._offset, length);
		this._offset += length;
		return String.fromCharCode.apply(null, characterCodes);
	}

	getNullTerminatedString(maxLength: number): string {
		const uint8Array = new Uint8Array(this._arrayBuffer, this._offset, maxLength);

		let length = -1;
		while (uint8Array[++length]) ;

		return this.getCharacters(length);
	}

	getLengthPrefixedString(): string {
		const length = this.getUint16();
		return this.getCharacters(length);
	}

	getUint8Array(length: number): Uint8Array {
		const result = new Uint8Array(this._arrayBuffer, this._offset, length);
		this._offset += length;
		return result;
	}

	getUint16Array(length: number): Uint16Array {
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

	getInt16Array(length: number): Int16Array {
		let result;

		if (this._offset % 2 !== 0) {
			let buffer = this._arrayBuffer.slice(this._offset, this._offset + length * 2);
			result = new Int16Array(buffer);
		} else {
			result = new Int16Array(this._arrayBuffer, this._offset, length);
		}

		this._offset += length * 2;
		return result;
	}

	getUint32Array(length: number): Uint32Array {
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
}

export default InputStream;
