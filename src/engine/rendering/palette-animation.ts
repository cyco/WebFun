import CompressedColorPalette from "./compressed-color-palette";

class PaletteAnimation {
	private _original: CompressedColorPalette;
	private _current: CompressedColorPalette;
	private _mutable: Uint32Array;
	private _state: boolean = true;

	public constructor(palette: CompressedColorPalette) {
		this._original = palette;
		this._current = palette.slice();
		this._mutable = new Uint32Array(this._current.buffer);
	}

	public reset() {
		this._current = this.original.slice();
		this._mutable = new Uint32Array(this._current.buffer);
		this._state = true;
	}

	public step() {
		// normal cycles
		this.cycle(10, 5);
		this.cycle(202, 1);
		this.cycle(204, 1);
		this.cycle(206, 1);
		this.cycle(224, 4);
		this.cycle(238, 5);

		// the remaining colors are animated slower
		if ((this._state = !this._state)) return;

		this.cycle(198, 1);
		this.cycle(200, 1);
		this.cycle(229, 8);
		this.cycle(215, 8);
		this.cycle(244, 1);
	}

	private cycle(start: number, count: number) {
		const end = this._mutable[start + count];
		do {
			this._mutable[start + count] = this._mutable[start + count - 1];
		} while (--count);

		this._mutable[start] = end;
	}

	get current(): CompressedColorPalette {
		return this._current;
	}

	get original(): CompressedColorPalette {
		return this._original;
	}
}

export default PaletteAnimation;
