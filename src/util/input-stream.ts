import { DataView, TextDecoder } from "src/std";

import Stream from "./stream";

const DefaultEncoding = "utf-8";

class InputStream extends Stream {
	private _arrayBuffer: ArrayBuffer | SharedArrayBuffer;
	private _dataView: DataView;

	constructor(data: ArrayBuffer | SharedArrayBuffer | string, endianness = Stream.Endian.Little) {
		super();

		this.endianness = endianness;
		this._arrayBuffer = this._makeArrayBuffer(data);
		this._dataView = new DataView(this._arrayBuffer);
	}

	public get length(): number {
		return this._arrayBuffer.byteLength;
	}

	public isAtEnd(): boolean {
		return this.offset === this.length;
	}

	private _makeArrayBuffer(
		data: ArrayBuffer | SharedArrayBuffer | string
	): ArrayBuffer | SharedArrayBuffer {
		if (typeof data === "string") {
			const binaryString = atob(data);
			const len = binaryString.length;
			const bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

			return bytes.buffer;
		}

		return data;
	}

	public readCharacter(): string {
		return String.fromCharCode(this.readUint8());
	}

	public readUint8(): number {
		const result = this._dataView.getUint8(this._offset);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
		return result;
	}

	public readUint16(): number {
		const result = this._dataView.getUint16(this._offset, this.littleEndian);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
		return result;
	}

	public readUint32(): number {
		const result = this._dataView.getUint32(this._offset, this.littleEndian);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
		return result;
	}

	public readInt8(): number {
		const result = this._dataView.getInt8(this._offset);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
		return result;
	}

	public readInt16(): number {
		const result = this._dataView.getInt16(this._offset, this.littleEndian);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
		return result;
	}

	public readInt32(): number {
		const result = this._dataView.getInt32(this._offset, this.littleEndian);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
		return result;
	}

	public readCharacters(length: number, encoding: string = DefaultEncoding): string {
		if (length === 0) return "";

		const data = new Uint8Array(this._arrayBuffer, this._offset, length);
		this._offset += length;

		const decoder = new TextDecoder(encoding);
		return decoder.decode(data);
	}

	public readCStringWithLength(fixedLength: number, encoding: string = DefaultEncoding): string {
		const raw = this.readUint8Array(fixedLength);
		let length = 0;
		while (length < raw.length && raw[length] !== 0) length++;

		const decoder = new TextDecoder(encoding);
		return decoder.decode(raw.slice(0, length));
	}

	public readNullTerminatedString(maxLength: number, encoding: string = DefaultEncoding): string {
		const uint8Array = new Uint8Array(this._arrayBuffer, this._offset, maxLength);

		let length = 0;
		while (uint8Array[length]) length++;

		return this.readCharacters(length, encoding);
	}

	public readLengthPrefixedString(encoding: string = DefaultEncoding): string {
		const length = this.readUint16();
		return this.readCharacters(length, encoding);
	}

	public readUint8Array(length: number): Uint8Array {
		const result = new Uint8Array(this._arrayBuffer, this._offset, length);
		this._offset += length;
		return result;
	}

	public readUint16Array(length: number): Uint16Array {
		let result;

		if (this._offset % 2 !== 0) {
			const buffer = this._arrayBuffer.slice(this._offset, this._offset + length * 2);
			result = new Uint16Array(buffer);
		} else {
			result = new Uint16Array(this._arrayBuffer, this._offset, length);
		}

		this._offset += length * 2;
		return result;
	}

	public readInt16Array(length: number): Int16Array {
		let result;

		if (this._offset % 2 !== 0) {
			const buffer = this._arrayBuffer.slice(this._offset, this._offset + length * 2);
			result = new Int16Array(buffer);
		} else {
			result = new Int16Array(this._arrayBuffer, this._offset, length);
		}

		this._offset += length * 2;
		return result;
	}

	public readUint32Array(length: number): Uint32Array {
		let result;

		if (this._offset % 4 !== 0) {
			const buffer = this._arrayBuffer.slice(this._offset, this._offset + length * 4);
			result = new Uint32Array(buffer);
		} else {
			result = new Uint32Array(this._arrayBuffer, this._offset, length);
		}

		this._offset += length * 4;
		return result;
	}

	public readInt32Array(length: number): Int32Array {
		let result;

		if (this._offset % 4 !== 0) {
			const buffer = this._arrayBuffer.slice(this._offset, this._offset + length * 4);
			result = new Int32Array(buffer);
		} else {
			result = new Int32Array(this._arrayBuffer, this._offset, length);
		}

		this._offset += length * 4;
		return result;
	}

	public get buffer(): ArrayBuffer | SharedArrayBuffer {
		return this._arrayBuffer;
	}
}

export default InputStream;
