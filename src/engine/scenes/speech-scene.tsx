import { Point, Size } from "src/util";

import Engine from "../engine";
import { ModalSession } from "src/ux";
import Scene from "./scene";
import { SpeechBubble } from "src/ui/components";
import { Tile } from "src/engine/objects";
import Sector from "src/engine/sector";
import { InputMask } from "../input";
import { Settings } from "src";

class SpeechScene extends Scene {
	public engine: Engine;
	public location: Point;
	public tileSize: Size = new Size(Tile.WIDTH, Tile.HEIGHT);
	public offset = new Point(0, 0);
	private _modalSession: ModalSession = null;
	private _bubble: SpeechBubble = (
		<SpeechBubble onend={() => this.engine.sceneManager.popScene()} style={{ position: "fixed" }} />
	) as SpeechBubble;

	constructor(engine: Engine = null) {
		super();

		this.engine = engine;
	}

	get text() {
		return this._bubble.text;
	}

	set text(t) {
		const world = this.engine.currentWorld;
		const sector = world.findSectorContainingZone(this.engine.currentZone);
		this._bubble.text = this.resolveVariables(t, sector);
	}

	private resolveVariables(text: string, quest: Sector) {
		if (!quest) return text;

		// Each placeholder has 2 variations, first is iso latin, second unicode.
		if (quest.findItem) text = text.replace(/[¢|Ľ]/g, quest.findItem.name);
		if (quest.requiredItem) text = text.replace(/[¥|˘]/g, quest.requiredItem.name);

		return text;
	}

	render() {}

	willShow() {
		this.engine.inputManager.mouseDownHandler = (_: Point): void => null;
		this._modalSession = new ModalSession();
		this._modalSession.run();

		const anchor = Point.add(this.location, this.cameraOffset);
		const { origin } = this.engine.sceneManager.bounds;

		const x = anchor.x * this.tileSize.width + origin.x + 16 + this.offset.x;
		const y = anchor.y * this.tileSize.height + origin.y + 32 + 32 + this.offset.y;
		this._bubble.origin = new Point(x, y);
		if (Settings.mobile) this._bubble.style.zoom = "1.2";

		this._bubble.show();
	}

	async update(ticks: number) {
		const input = this.engine.inputManager.readInput(ticks);
		if (input & InputMask.EndDialog) {
			this._bubble.end();
		}
	}

	willHide() {
		this.engine.inputManager.mouseDownHandler = () => void 0;
		this._modalSession.end(0);
	}

	isOpaque(): boolean {
		return false;
	}
}

export default SpeechScene;
