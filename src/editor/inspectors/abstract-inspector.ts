import { Window } from "src/ui/components";

abstract class AbstractInspector {
	public state: Storage;
	public window: Window = <Window>document.createElement(Window.TagName);

	show() {
		document.body.appendChild(this.window);
	}
}

export default AbstractInspector;
