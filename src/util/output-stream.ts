import Stream from "./stream";

class OutputStream extends Stream {
	private _arrayBuffer: ArrayBuffer;
	private _dataView: DataView;

	constructor(size: number) {
		super();

		this.endianess = Stream.ENDIAN.LITTLE;
		this._arrayBuffer = new ArrayBuffer(size);
		this._dataView = new DataView(this._arrayBuffer);
	}

	get buffer() {
		return this._arrayBuffer.slice(0, this._offset);
	}

	writeUint8(value: number): void {
		this._dataView.setUint8(this._offset, value);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeUint16(value: number): void {
		this._dataView.setUint16(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeUint32(value: number): void {
		this._dataView.setUint32(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	writeInt8(value: number): void {
		this._dataView.setInt8(this._offset, value);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeInt16(value: number): void {
		this._dataView.setInt16(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeInt32(value: number): void {
		this._dataView.setInt32(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
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

	writeUint8Array(array: number[]|Uint8Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint8(array[i]);
		}
	}

	writeUint16Array(array: number[]|Uint16Array|Int16Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint16(array[i]);
		}
	}

	writeInt16Array(array: number[]|Int16Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeInt16(array[i]);
		}
	}

	writeUint32Array(array: number[]|Uint32Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint32(array[i]);
		}
	}
}

export default OutputStream;
