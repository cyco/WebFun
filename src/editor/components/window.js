import { Window } from "src/ui/components";
import "./window.scss";

export default class extends Window {
	static get TagName() {
		return "wf-editor-window";
	}
}
