import Scene from "./scene";
import { Tile } from "/engine/objects";
import { SpeechBubble } from "/ui";
import { ModalSession } from "/ux";
import { Size, Point } from "/util";
import Settings from "/settings";

export default class SpeechScene extends Scene {
	constructor(engine = null) {
		super();

		this.engine = engine;
		this.location = null;

		this.tileSize = new Size(Tile.WIDTH, Tile.HEIGHT);
		this._modalSession = null;

		this._setupBubble();
	}

	_setupBubble() {
		const bubble = new SpeechBubble();
		bubble.onend = () => this.engine.sceneManager.popScene();
		this._bubble = bubble;
	}

	willShow() {
		this.engine.inputManager.mouseDownHandler = () => null;
		this._modalSession = new ModalSession();
		this._modalSession.run();

		const anchor = Point.add(this.location, this.cameraOffset);

		const windowOffset = this._determineGlobalOffset();

		// TODO: fix posiitoning
		this._bubble.x = anchor.x * this.tileSize.width + windowOffset.x + 32;
		this._bubble.y = anchor.y * this.tileSize.height + windowOffset.y + 2 * 32;

		this._bubble.show();
	}

	update() {
		if (Settings.skipDialogs || this.engine.inputManager.endDialog) {
			this._bubble.end();
		}
	}

	willHide() {
		this.engine.inputManager.mouseDownHandler = null;
		this._modalSession.end(0);
	}

	set text(t) {
		this._bubble.text = t;
	}

	get text() {
		return this._bubble.text;
	}

	_determineGlobalOffset() {
		const canvas = document.querySelector('canvas[width="288"][height="288"]');
		const box = canvas.getBoundingClientRect();

		return new Point(box.left, box.top, 0);
	}
}
