import { DOMAudioChannel } from "./audio";
import { CanvasRenderer } from "./rendering";
import { DesktopInputManager } from "./input";
import { SceneView } from "./ui";
import Loader from "./loader";

export default {
	Channel: () => new DOMAudioChannel(),
	Renderer: (canvas: HTMLCanvasElement) => new CanvasRenderer.Renderer(canvas),
	InputManager: (view: SceneView) => new DesktopInputManager(view),
	Loader: () => new Loader()
};
