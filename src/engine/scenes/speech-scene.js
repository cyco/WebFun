import Scene from '/engine/scenes/scene';
import Tile from '/engine/objects/tile';
import SpeechBubble from '/ui/speech-bubble';
import { ModalSession } from '/ux';
import Size from '/util/size';
import Point from '/util/point';
import Settings from '/settings';

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
		const self = this;
		const bubble = new SpeechBubble();
		bubble.onend = () => self.engine.sceneManager.popScene();
		this._bubble = bubble;
	}

	willShow() {
		this.engine.inputManager.mouseDownHandler = () => null;
		this._modalSession = new ModalSession();
		this._modalSession.run();

		const anchor = Point.add(this.location, this.cameraOffset);
		const offset = this.engine.state.viewOffset;

		this._bubble.x = anchor.x * this.tileSize.width + offset.x;
		this._bubble.y = anchor.y * this.tileSize.height + offset.y;

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
}
