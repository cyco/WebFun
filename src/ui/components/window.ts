import "./window.scss";

import AbstractWindow, { Event } from "./abstract-window";

class Window extends AbstractWindow {
	public static readonly tagName = "wf-window";
}

export default Window;
export { Event };
