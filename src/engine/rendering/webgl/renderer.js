import AbstractRenderer from "../abstract-renderer";
import ImageFactory from './image-factory';

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
	}

	get imageFactory() {
		return this._imageFactory;
	}
}

export default WebGLRenderer;
