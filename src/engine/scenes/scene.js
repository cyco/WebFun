export default class Scene {
	constructor() {
		this.engine = null;
	}

	willShow() {
	}

	didShow() {
	}

	willHide() {
	}

	didHide() {
	}

	render() {
	}

	update() {
	}

	isOpaque() {
		return true;
	}

	get cameraOffset() {
		// TODO: remove access to private variable stack and dependency on stack order
		return this.engine.sceneManager._stack[ 0 ].camera.offset;
	}
}
