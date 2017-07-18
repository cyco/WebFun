import Renderer from "../renderer";

class WebGLRenderer extends Renderer {
	static isSupported() {
		const canvas = document.createElement('canvas');
		return canvas.getContext("webgl") !== null;
	}

	constructor(canvas) {
		super(canvas);

		this._canvas = canvas;
		this._context = canvas.getContext('webgl');
	}
}

export default WebGLRenderer;
