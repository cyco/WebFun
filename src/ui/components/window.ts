import AbstractWindow, { Event } from "./abstract-window";
import "./window.scss";

class Window extends AbstractWindow {
	public static readonly tagName = "wf-window";
}

export default Window;
export { Event };
