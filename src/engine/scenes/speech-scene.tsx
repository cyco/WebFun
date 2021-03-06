import { Point, Size } from "src/util";

import Engine from "../engine";
import Scene from "./scene";
import { Tile } from "src/engine/objects";
import Sector from "src/engine/sector";

class SpeechScene extends Scene {
	public engine: Engine;
	public location: Point;
	public tileSize: Size = new Size(Tile.WIDTH, Tile.HEIGHT);
	public offset = new Point(0, 0);
	public text: string = "";

	constructor(engine: Engine) {
		super();

		this.engine = engine;
	}

	render(): void {}

	public willShow(): void {
		this.engine.inputManager.mouseDownHandler = null;

		const anchor = Point.add(this.location, this.cameraOffset);
		const sector = this.engine.currentSector;
		const text = this.resolveVariables(this.text, sector);

		this.engine.showText(text, anchor).then(() => this.engine.sceneManager.popScene());
	}

	private resolveVariables(text: string, quest: Sector) {
		if (!quest) return text;

		// Each placeholder has 2 variations, first is iso latin, second unicode.
		if (quest.findItem) text = text.replace(/[¢|Ľ]/g, quest.findItem.name);
		if (quest.requiredItem) text = text.replace(/[¥|˘]/g, quest.requiredItem.name);

		return text;
	}

	async update(_: number): Promise<void> {}

	public willHide(): void {
		this.engine.inputManager.mouseDownHandler = null;
		this.engine.inputManager.clear();
	}

	isOpaque(): boolean {
		return false;
	}
}

export default SpeechScene;
