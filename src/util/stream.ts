export const SEEK = {
	SET: 0,
	CUR: 1
};

export const ENDIAN = {
	LITTLE: 0,
	BIG: 1
};

class Stream {
	public static readonly SEEK = SEEK;
	public static readonly ENDIAN = ENDIAN;

	public endianess: number = Stream.ENDIAN.BIG;
	protected _offset: number = 0;

	seek(offset: number, mode: number) {
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

export default Stream;
