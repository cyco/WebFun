import Stream from "./stream";

class OutputStream extends Stream {
	private _arrayBuffer: ArrayBuffer;
	private _dataView: DataView;

	constructor(size: number) {
		super();

		this.endianess = Stream.Endian.Little;
		this._arrayBuffer = new ArrayBuffer(size);
		this._dataView = new DataView(this._arrayBuffer);
	}

	public get buffer() {
		return this._arrayBuffer.slice(0, this._offset);
	}

	public writeUint8(value: number): void {
		this._dataView.setUint8(this._offset, value);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	public writeUint16(value: number): void {
		this._dataView.setUint16(this._offset, value, this.endianess === Stream.Endian.Little);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	public writeUint32(value: number): void {
		this._dataView.setUint32(this._offset, value, this.endianess === Stream.Endian.Little);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	public writeInt8(value: number): void {
		this._dataView.setInt8(this._offset, value);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	public writeInt16(value: number): void {
		this._dataView.setInt16(this._offset, value, this.endianess === Stream.Endian.Little);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	public writeInt32(value: number): void {
		this._dataView.setInt32(this._offset, value, this.endianess === Stream.Endian.Little);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	public writeCharacters(string: string): void {
		for (let i = 0, len = string.length; i < len; i++) {
			this.writeUint8(string.charCodeAt(i));
		}
	}

	public writeNullTerminatedString(string: string): void {
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	public writeLengthPrefixedString(string: string): void {
		this.writeUint16(string.length);
		this.writeCharacters(string);
	}

	public writeLengthPrefixedNullTerminatedString(string: string): void {
		this.writeUint16(string.length + 1);
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	public writeUint8Array(array: number[] | Uint8Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint8(array[i]);
		}
	}

	public writeInt8Array(array: number[] | Int8Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeInt8(array[i]);
		}
	}

	public writeUint16Array(array: number[] | Uint16Array | Int16Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint16(array[i]);
		}
	}

	public writeInt16Array(array: number[] | Int16Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeInt16(array[i]);
		}
	}

	public writeUint32Array(array: number[] | Uint32Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint32(array[i]);
		}
	}

	public writeInt32Array(array: number[] | Int32Array): void {
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeInt32(array[i]);
		}
	}
}

export default OutputStream;
