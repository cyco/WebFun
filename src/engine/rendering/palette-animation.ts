import ColorPalette from "./color-palette";

class PaletteAnimation {
	private _original: ColorPalette;
	private _current: ColorPalette;
	private _state: boolean = true;

	public constructor(palette: ColorPalette) {
		this._original = palette;
		this._current = palette.slice();
	}

	public reset(): void {
		this._current = this.original.slice();
		this._state = true;
	}

	public step(): void {
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
		const end = this._current[start + count];
		do {
			this._current[start + count] = this._current[start + count - 1];
		} while (--count);

		this._current[start] = end;
	}

	get current(): ColorPalette {
		return this._current;
	}

	get original(): ColorPalette {
		return this._original;
	}
}

export default PaletteAnimation;
