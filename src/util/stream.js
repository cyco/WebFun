export const SEEK = {
	SET: 0,
	CUR: 1
};

export const ENDIAN = {
	LITTLE: 0,
	BIG: 1
};

export default class Stream {
	constructor() {
		this.endianess = Stream.ENDIAN.BIG;
		this._offset = 0;
	}

	seek(offset, mode) {
		switch (mode) {
			case Stream.SEEK.SET:
				this._offset = offset;
				break;
			case Stream.SEEK.CUR:
				this._offset += offset;
				break;
		}
	}

	get littleEndian() {
		return this.endianess === Stream.ENDIAN.LITTLE;
	}

	get offset() {
		return this._offset;
	}
}

Stream.SEEK = SEEK;
Stream.ENDIAN = ENDIAN;
