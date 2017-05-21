import Tool from './tool';

export default class extends Tool {
	get name() {
		return 'Paint Bucket';
	}

	get icon() {
		return 'paint-bucket';
	}

	activate() {}
	deactivate() {}
}
