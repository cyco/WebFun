import OutputStream from "./output-stream";
import Stream from "./stream";

class DiscardingOutputStream extends OutputStream {
	constructor() {
		super(0);

		this.endianess = Stream.ENDIAN.LITTLE;
	}

	writeUint8(value) {
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeUint16(value) {
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeUint32(value) {
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	writeInt8(value) {
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeInt16(value) {
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeInt32(value) {
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	writeCharacters(string) {
		for (let i = 0, len = string.length; i < len; i++) {
			this.writeUint8(string.charCodeAt(i));
		}
	}

	writeNullTerminatedString(string) {
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	writeLengthPrefixedString(string) {
		this.writeUint16(string.length);
		this.writeCharacters(string);
	}

	writeLengthPrefixedNullTerminatedString(string) {
		this.writeUint16(string.length + 1);
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	writeUint8Array(array) {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint8(array[ i ]);
		}
	}

	writeUint16Array(array) {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint16(array[ i ]);
		}
	}

	writeInt16Array(array) {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeInt16(array[ i ]);
		}
	}

	writeUint32Array(array) {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint32(array[ i ]);
		}
	}

	get buffer() {
		return null;
	}
}

export default DiscardingOutputStream;
