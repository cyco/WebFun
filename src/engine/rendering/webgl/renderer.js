import AbstractRenderer from "../abstract-renderer";
import ImageFactory from './image-factory';

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

import twgl from 'twgl.js';

class WebGLRenderer extends AbstractRenderer {
	static isSupported() {
		const canvas = document.createElement('canvas');
		return canvas.getContext("webgl") !== null;
	}

	constructor(canvas) {
		super(canvas);

		this._canvas = canvas;
		this._context = canvas.getContext('webgl');
		this._imageFactory = new ImageFactory(this._context);
		this._imageFactory.onpalettechange = (palette) => this._setupPalette(palette);
		this._paletteTexture = null;

		this._setupShaders(this._context);
		this._setupVertexBuffer(this._context);
	}

	_setupPalette(bgrPalette) {
		const gl = this._context;
		const palette = this._convertToRGBA(bgrPalette);

		gl.activeTexture(gl.TEXTURE1);
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);

		this._paletteTexture = texture;
	}

	_convertToRGBA(bgrPalette) {
		const rgbaPalette = new Uint8Array(bgrPalette.length);
		for (let i = 0; i <= 0xFF; i++) {
			rgbaPalette[4 * i + 0] = bgrPalette[4 * i + 2];
			rgbaPalette[4 * i + 1] = bgrPalette[4 * i + 1];
			rgbaPalette[4 * i + 2] = bgrPalette[4 * i + 0];
			rgbaPalette[4 * i + 3] = 0xFF;
		}

		// make sure color 0 is transparent
		rgbaPalette[3] = 0x00;

		return rgbaPalette;
	}

	renderTile(tile, x, y) {
		if (!tile) return;
		const gl = this._context;

		const positions = [
			x + 1, 8 - y + 1,
			x + 0, 8 - y + 1,
			x + 0, 8 - y + 0,
			x + 1, 8 - y + 1,
			x + 0, 8 - y + 0,
			x + 1, 8 - y + 0,
		];

		const vertBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, tile.image.representation);
		gl.drawArrays(gl.TRIANGLES, 0, 12 / 2);
	}

	clear() {
		const gl = this._context;
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	get imageFactory() {
		return this._imageFactory;
	}

	_setupShaders(gl) {
		const program = twgl.createProgramFromSources(
			gl,
			[VertexShader, FragmentShader],
			["a_position", "a_textureIndex", "a_palette_position"]);
		gl.useProgram(program);
		gl.uniform1i(gl.getUniformLocation(program, "u_image"), 0);
		gl.uniform1i(gl.getUniformLocation(program, "u_palette"), 1);
	}

	_setupVertexBuffer(gl) {
		const palette_positions = [
			1, 1,
			-1, 1,
			-1, -1,
			1, 1,
			-1, -1,
			1, -1,
		];
		const vertBuffer2 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer2);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(palette_positions), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(2);
		gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
	}
}

export default WebGLRenderer;
