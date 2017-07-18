import Renderer from "../renderer";

export default class {
	static isSupported() {
		const canvas = document.createElement('canvas');
		return canvas.getContext("webgl") !== null;
	}
}
