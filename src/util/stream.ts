export const Seek = {
	Set: 0,
	Cur: 1
};

export const Endian = {
	Little: 0,
	Big: 1
};

class Stream {
	public static readonly Seek = Seek;
	public static readonly Endian = Endian;

	public endianness: number = Stream.Endian.Big;
	protected _offset: number = 0;

	public get littleEndian() {
		return this.endianness === Stream.Endian.Little;
	}

	public get offset() {
		return this._offset;
	}

	public seek(offset: number, mode: number = Stream.Seek.Cur) {
		switch (mode) {
			case Stream.Seek.Set:
				this._offset = offset;
				break;
			case Stream.Seek.Cur:
				this._offset += offset;
				break;
		}
	}
}

export default Stream;
