import Tool from "./tool";

export default class extends Tool {
	activate() {
	}

	deactivate() {
	}

	get name() {
		return "Move";
	}

	get icon() {
		return "mouse-pointer";
	}

	get shortcut() {
		return "v";
	}
}
