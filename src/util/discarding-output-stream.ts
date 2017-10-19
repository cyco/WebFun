import OutputStream from "./output-stream";
import Stream from "./stream";

class DiscardingOutputStream extends OutputStream {
	constructor() {
		super(0);

		this.endianess = Stream.ENDIAN.LITTLE;
	}

	writeUint8(value: number) {
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeUint16(value: number) {
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeUint32(value: number) {
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	writeInt8(value: number) {
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeInt16(value: number) {
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeInt32(value: number) {
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	writeCharacters(string: string) {
		for (let i = 0, len = string.length; i < len; i++) {
			this.writeUint8(string.charCodeAt(i));
		}
	}

	writeNullTerminatedString(string: string) {
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	writeLengthPrefixedString(string: string) {
		this.writeUint16(string.length);
		this.writeCharacters(string);
	}

	writeLengthPrefixedNullTerminatedString(string: string) {
		this.writeUint16(string.length + 1);
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	writeUint8Array(array: number[]) {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint8(array[i]);
		}
	}

	writeUint16Array(array: number[]) {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint16(array[i]);
		}
	}

	writeInt16Array(array: number[]) {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeInt16(array[i]);
		}
	}

	writeUint32Array(array: number[]) {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint32(array[i]);
		}
	}

	get buffer(): ArrayBuffer {
		return null;
	}
}

export default DiscardingOutputStream;
