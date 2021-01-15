import OutputStream from "./output-stream";
import Stream from "./stream";

class DiscardingOutputStream extends OutputStream {
	constructor() {
		super(0);

		this.endianness = Stream.Endian.Little;
	}

	get buffer(): ArrayBuffer {
		return null;
	}

	writeUint8(_: number): void {
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeUint16(_: number): void {
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeUint32(_: number): void {
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	writeInt8(_: number): void {
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeInt16(_: number): void {
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeInt32(_: number): void {
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	writeCharacters(string: string): void {
		for (let i = 0, len = string.length; i < len; i++) {
			this.writeUint8(string.charCodeAt(i));
		}
	}

	writeNullTerminatedString(string: string): void {
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	writeLengthPrefixedString(string: string): void {
		this.writeUint16(string.length);
		this.writeCharacters(string);
	}

	writeLengthPrefixedNullTerminatedString(string: string): void {
		this.writeUint16(string.length + 1);
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	writeUint8Array(array: number[]): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint8(array[i]);
		}
	}

	writeUint16Array(array: number[]): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint16(array[i]);
		}
	}

	writeInt16Array(array: number[]): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeInt16(array[i]);
		}
	}

	writeUint32Array(array: number[]): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint32(array[i]);
		}
	}
}

export default DiscardingOutputStream;
