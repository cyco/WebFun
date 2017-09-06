import { Window } from "src/ui/components";
import { FileLoader } from "src/util";
import Settings from "src/settings";
import { twgl } from "libs";
import VertexShader from "./vertex.glsl";
import FragmentShader from "./fragment.glsl";

export default class {
	constructor() {
		this._palette = null;

		this._window = document.createElement(Window.TagName);
		this._window.title = "WebGL Debug";
		this._window.content.style.display = "block";
		this._window.content.style.width = "200px";
		this._window.content.style.height = "300px";
		this._window.content.style.fontSize = "9pt";

		this._canvas = document.createElement("canvas");
		this._canvas.style.border = "1px solid black";
		this._canvas.width = "180";
		this._canvas.height = "180";
		this._window.content.appendChild(this._canvas);

		const gl = this._canvas.getContext("webgl");
		if (!gl) throw "WebGL is not available!";

		this._context = gl;

		this._loadPalette(gl);
		this._determineSpecs(gl);

		document.body.appendChild(this._window);
		this._window.center();
	}

	_setupShaders(gl) {
		// Note: createProgramFromScripts will call bindAttribLocation
		// based on the index of the attibute names we pass to it.
		const program = twgl.createProgramFromSources(
			gl,
			[ VertexShader, FragmentShader ],
			[ "a_position", "a_textureIndex", "a_palette_position" ]);
		gl.useProgram(program);
		const imageLoc = gl.getUniformLocation(program, "u_image");
		const paletteLoc = gl.getUniformLocation(program, "u_palette");
		// tell it to use texture units 0 and 1 for the image and palette
		gl.uniform1i(imageLoc, 0);
		gl.uniform1i(paletteLoc, 1);
	}

	_setupVertexBuffer(gl) {
		// Setup a unit quad
		const positions = [
			0.5, 0.5,
			-0.5, 0.5,
			-0.5, -0.5,
			0.5, 0.5,
			-0.5, -0.5,
			0.5, -0.5
		];
		const vertBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);


		const palette_positions = [
			1, 1,
			-1, 1,
			-1, -1,
			1, 1,
			-1, -1,
			1, -1
		];
		const vertBuffer2 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer2);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(palette_positions), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(2);
		gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
	}

	_loadPalette() {
		const loader = new FileLoader(Settings.url.palette);
		loader.onload = event => this._didLoadPalette(event.detail.arraybuffer);
		loader.load();
	}

	_didLoadPalette(buffer) {
		const gl = this._context;

		this._setupShaders(gl);
		this._setupVertexBuffer(gl);

		// Setup a palette.
		const palette = new Uint8Array(buffer);
		for (let i = 0; i <= 0xFF; i++) {
			const temp = palette[ 4 * i + 0 ];
			palette[ 4 * i + 0 ] = palette[ 4 * i + 2 ];
			palette[ 4 * i + 2 ] = temp;
			palette[ 4 * i + 3 ] = 0xFF;
		}
		palette[ 3 ] = 0;

		// make palette texture and upload palette
		gl.activeTexture(gl.TEXTURE1);
		const paletteTex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, paletteTex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);

		this._makeSampleImage(gl);

		function render() {
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		}

		render();
	}

	_makeSampleImage(gl) {
		// Make image. Just going to make something 8x8
		const width = 16;
		const height = 16;
		const image = new Uint8Array(width * height);
		for (let i = 0; i <= 0xFF; i++) {
			image[ i ] = i;
		}

		// make image textures and upload image
		gl.activeTexture(gl.TEXTURE0);
		const imageTex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, imageTex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, width, height, 0, gl.ALPHA, gl.UNSIGNED_BYTE, image);
	}

	_determineSpecs(gl) {
		this._window.content.appendChild(document.createElement("br"));

		const textureImageUnits = document.createElement("div");
		textureImageUnits.textContent = `MAX_TEXTURE_IMAGE_UNITS: ${gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)}`;
		this._window.content.appendChild(textureImageUnits);

		const maxTextureSize = document.createElement("div");
		maxTextureSize.textContent = `MAX_TEXTURE_SIZE: ${gl.getParameter(gl.MAX_TEXTURE_SIZE)}`;
		this._window.content.appendChild(maxTextureSize);
	}

	render() {
		if (!this._palette) return;

		const gl = this._context;
		gl.activeTexture(gl.TEXTURE1);
		// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);

		gl.drawArrays(gl.TRIANGLES, 0, 12 / 2);
		requestAnimationFrame(() => this.render());
	}
}
