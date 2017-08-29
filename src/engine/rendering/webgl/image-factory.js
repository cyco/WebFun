import AbstractImageFactory from "../abstract-image-factory";
import Image from "../image";

class ImageFactory extends AbstractImageFactory {
	constructor(gl) {
		super();
		this._gl = gl;
		this._palette = null;
	}

	buildImage(width, height, pixels) {
		const gl = this._gl;

		gl.activeTexture(gl.TEXTURE0);
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, width, height, 0, gl.ALPHA, gl.UNSIGNED_BYTE, pixels);

		return new Image(width, height, texture);
	}

	get palette() {
		return this._palette;
	}

	set palette(palette) {
		this._palette = palette;
		if (this.onpalettechange instanceof Function) {
			this.onpalettechange(palette);
		}
	}
}

export default ImageFactory;
