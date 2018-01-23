import { Tile } from "src/engine/objects";
import Settings from "src/settings";
import { SpeechBubble } from "src/ui/components";
import { Point, Size } from "src/util";
import { ModalSession } from "src/ux";
import Engine from "../engine";
import Scene from "./scene";

class SpeechScene extends Scene {
	public engine: Engine;
	public location: Point;
	public tileSize: Size = new Size(Tile.WIDTH, Tile.HEIGHT);
	private _modalSession: ModalSession = null;
	private _bubble: SpeechBubble;

	constructor(engine: Engine = null) {
		super();

		this.engine = engine;
		this._setupBubble();
	}

	get text() {
		return this._bubble.text;
	}

	set text(t) {
		this._bubble.text = t;
	}

	_setupBubble() {
		const bubble = <SpeechBubble>document.createElement(SpeechBubble.TagName);
		bubble.onend = () => this.engine.sceneManager.popScene();
		this._bubble = bubble;
	}

	render() {
	}

	willShow() {
		this.engine.inputManager.mouseDownHandler = (p: Point): void => null;
		this._modalSession = new ModalSession();
		this._modalSession.run();

		const anchor = Point.add(this.location, this.cameraOffset);

		const windowOffset = this._determineGlobalOffset();

		// TODO: fix posiitoning
		const x = anchor.x * this.tileSize.width + windowOffset.x + 32;
		const y = anchor.y * this.tileSize.height + windowOffset.y + 2 * 32;
		this._bubble.origin = new Point(x, y);
		this._bubble.show();
	}

	async update() {
		if (Settings.skipDialogs || this.engine.inputManager.endDialog) {
			this._bubble.end();
		}
	}

	willHide() {
		this.engine.inputManager.mouseDownHandler = null;
		this._modalSession.end(0);
	}

	_determineGlobalOffset() {
		const canvas = document.querySelector("canvas[width=\"288\"][height=\"288\"]");
		const box = canvas.getBoundingClientRect();

		return new Point(box.left, box.top, 0);
	}
}

export default SpeechScene;
