import ColorPalette from "./color-palette";

class PaletteAnimation {
	private _original: ColorPalette;
	private _current: ColorPalette;
	private _state: number = 0;

	public constructor(palette: ColorPalette) {
		this._original = palette;
		this._current = palette.slice();
	}

	reset() {
		this._current = this.original.slice();
		this._state = 0;
	}

	step(distance: number = 1) {
		this._state += distance;
	}

	get current(): ColorPalette {
		return this._current;
	}

	get original(): ColorPalette {
		return this._original;
	}
}
export default PaletteAnimation;
