import { SettingsWindow } from "/app/ui/components";
import "./difficulty-window.scss"

class DifficultyWindow extends SettingsWindow {
	static get TagName() {
		return 'wf-difficulty-window';
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.setAttribute('title', 'Difficulty');
		this.setAttribute('key', 'difficulty');
		this.setAttribute('min-label', 'Easy');
		this.setAttribute('mid-label', 'Medium');
		this.setAttribute('max-label', 'Hard');

		super.connectedCallback();
	}
}
export default DifficultyWindow;
