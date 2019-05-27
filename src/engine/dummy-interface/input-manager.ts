import { InputManager } from "../input";
import { Point } from "src/util";

class DummyInputManager extends InputManager {
	mouseLocationInView: Point;

	public clear(): void {
		throw new Error("Method not implemented.");
	}

	public addListeners(): void {
		throw new Error("Method not implemented.");
	}

	public removeListeners(): void {
		throw new Error("Method not implemented.");
	}
}

export default DummyInputManager;
