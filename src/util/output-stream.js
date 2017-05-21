import Stream from "./stream";

export default class OutputStream extends Stream {
	constructor(size) {
		super();

		this.endianess = Stream.ENDIAN.LITTLE;
		this._arrayBuffer = new ArrayBuffer(size);
		this._dataView = new DataView(this._arrayBuffer);
	}

	get buffer() {
		return this._arrayBuffer.slice(0, this._offset);
	}

	// // // // // // // // // // // // // // // // // //

	writeUint8(value) {
		if(value === undefined) debugger;
		this._dataView.setUint8(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeUint16(value) {
		if(value === undefined) debugger;
		this._dataView.setUint16(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeUint32(value) {
		if(value === undefined) debugger;
		this._dataView.setUint32(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	writeInt8(value) {
		if(value === undefined) debugger;
		this._dataView.setInt8(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
		this._offset += Uint8Array.BYTES_PER_ELEMENT;
	}

	writeInt16(value) {
		if(value === undefined) debugger;
		this._dataView.setInt16(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
		this._offset += Uint16Array.BYTES_PER_ELEMENT;
	}

	writeInt32(value) {
		if(value === undefined) debugger;
		this._dataView.setInt32(this._offset, value, this.endianess === Stream.ENDIAN.LITTLE);
		this._offset += Uint32Array.BYTES_PER_ELEMENT;
	}

	// // // // // // // // // // // // // // // // // //

	writeCharacters(string) {
		if(string === undefined) debugger;
		for (let i = 0, len = string.length; i < len; i++) {
			this.writeUint8(string.charCodeAt(i));
		}
	}

	writeNullTerminatedString(string) {
		if(string === undefined) debugger;
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	writeLengthPrefixedString(string) {
		if(string === undefined) debugger;
		this.writeUint16(string.length);
		this.writeCharacters(string);
	}
	
	writeLengthPrefixedNullTerminatedString(string) {
		if(string === undefined) debugger;
		this.writeUint16(string.length+1);
		this.writeCharacters(string);
		this.writeUint8(0);
	}

	// // // // // // // // // // // // // // // // // //

	writeUint8Array(array) {
		if(array === undefined) debugger;
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint8(array[i]);
		}
	}

	writeUint16Array(array) {
		if(array === undefined) debugger;
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint16(array[i]);
		}
	}

	writeUint32Array(array) {
		if(array === undefined) debugger;
		for (let i = 0, len = array.length; i < len; i++) {
			this.writeUint32(array[i]);
		}
	}
}
