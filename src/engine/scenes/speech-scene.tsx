import { Tile } from "src/engine/objects";
import Settings from "src/settings";
import { SpeechBubble } from "src/ui/components";
import { Point, Size, Rectangle } from "src/util";
import { ModalSession } from "src/ux";
import Engine from "../engine";
import Scene from "./scene";
import { WorldItem } from "src/engine/generation";

class SpeechScene extends Scene {
	public engine: Engine;
	public location: Point;
	public tileSize: Size = new Size(Tile.WIDTH, Tile.HEIGHT);
	private _modalSession: ModalSession = null;
	private _bubble: SpeechBubble = (
		<SpeechBubble onend={() => this.engine.sceneManager.popScene()} />
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
		const quest = world.at(this.engine.temporaryState.worldLocation);

		this._bubble.text = this.resolveVariables(t, quest);
	}

	private resolveVariables(text: string, quest: WorldItem) {
		if (quest.findItem) text = text.replace(/¢/g, quest.findItem.name);
		if (quest.requiredItem) text = text.replace(/¥/g, quest.requiredItem.name);

		return text;
	}

	render() {}

	willShow() {
		this.engine.inputManager.mouseDownHandler = (_: Point): void => null;
		this._modalSession = new ModalSession();
		this._modalSession.run();

		const anchor = Point.add(this.location, this.cameraOffset);
		const { origin } = this.engine.sceneManager.bounds;

		const x = anchor.x * this.tileSize.width + origin.x + 16;
		const y = anchor.y * this.tileSize.height + origin.y + 32 + 32;
		this._bubble.origin = new Point(x, y);
		this._bubble.show();
	}

	async update() {
		if (Settings.skipDialogs || this.engine.inputManager.endDialog) {
			this._bubble.end();
		}
	}

	willHide() {
		this.engine.inputManager.mouseDownHandler = () => void 0;
		this._modalSession.end(0);
	}
}

export default SpeechScene;
