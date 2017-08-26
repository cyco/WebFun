import Tool from "./tool";

export default class extends Tool {
	get name() {
		return "Move";
	}

	get icon() {
		return "mouse-pointer";
	}

	get shortcut() {
		return "v";
	}

	activate() {
	}

	deactivate() {
	}
}
