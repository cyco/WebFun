import ColorPalette from "./color-palette";

export type ColorCycle = [number, number];

class PaletteAnimation {
	private _original: ColorPalette;
	private _current: ColorPalette;
	private _state: boolean = true;

	public constructor(
		palette: ColorPalette,
		private fastAnimations: ColorCycle[],
		private slowAnimations: ColorCycle[]
	) {
		this._original = palette;
		this._current = palette.slice();
	}

	public reset(): void {
		this._current = this.original.slice();
		this._state = true;
	}

	public step(): void {
		this.fastAnimations.forEach(([start, colorCount]) => this.cycle(start, colorCount));

		if ((this._state = !this._state)) return; // wait for next update

		this.slowAnimations.forEach(([start, colorCount]) => this.cycle(start, colorCount));
	}

	private cycle(start: number, count: number) {
		let remaining = count - 1;
		const end = this._current[start + remaining];
		do {
			this._current[start + remaining] = this._current[start + remaining - 1];
		} while (--remaining);

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
