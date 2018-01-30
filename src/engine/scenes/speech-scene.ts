import { Tile } from "src/engine/objects";
import Settings from "src/settings";
import { SpeechBubble } from "src/ui/components";
import { Point, Size } from "src/util";
import { ModalSession } from "src/ux";
import Engine from "../engine";
import Scene from "./scene";
import { WorldItem } from 'src/engine/generation';

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
		const zone = this.engine.currentZone;
		const world = this.engine.currentWorld;
		const quest = world.at(this.engine.state.worldLocation);

		this._bubble.text = this.resolveVariables(t, quest);
	}

	private resolveVariables(text: string, quest: WorldItem) {
		if (quest.findItem) text = text.replace(/¢/g, quest.findItem.name);
		if (quest.requiredItem) text = text.replace(/¥/g, quest.requiredItem.name);

		return text;
	}

	private _setupBubble() {
		const bubble = <SpeechBubble>document.createElement(SpeechBubble.TagName);
		bubble.onend = () => this.engine.sceneManager.popScene();
		this._bubble = bubble;
	}

	render() { }

	willShow() {
		this.engine.inputManager.mouseDownHandler = (p: Point): void => null;
		this._modalSession = new ModalSession();
		this._modalSession.run();

		const anchor = Point.add(this.location, this.cameraOffset);

		const windowOffset = this._determineGlobalOffset();

		// TODO: fix positioning
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

	private _determineGlobalOffset(): Point {
		const canvas = document.querySelector('canvas[width="288"][height="288"]');
		const box = canvas.getBoundingClientRect();

		return new Point(box.left, box.top, 0);
	}
}

export default SpeechScene;
