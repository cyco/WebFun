import { Component } from "src/ui";
import { World } from "src/engine/save-game";
import { CSSTileSheet } from "src/editor";
import { GameData, ColorPalette } from "src/engine";
import { SaveState } from "src/engine/save-game";
import TransformCanvas, { TransformCanvasRenderingContext2D } from "./transform-canvas";
import "./world-view.scss";
import { drawZoneImageData as drawZone } from "src/engine/rendering/canvas";

class WorldView extends Component {
	public static readonly tagName = "wf-save-game-editor-world-view";

	private _canvas: TransformCanvas = (
		<TransformCanvas className="pixelated" width={288} height={288} />
	) as TransformCanvas;
	public gameData: GameData;
	public state: SaveState;
	public world: World;
	public palette: ColorPalette;
	public tileSheet: CSSTileSheet;

	private _zoneImages: HTMLImageElement[];

	public constructor() {
		super();
		this._canvas.draw = ctx => this.draw(ctx);
	}

	public async connectedCallback() {
		super.connectedCallback();

		this._zoneImages = await Promise.all(
			this.state.world
				.map(({ zoneId }: any) => zoneId)
				.map((id: number) => drawZone(this.gameData.zones[id], this.palette).toImage())
		);

		this._canvas.width = 10 * 32 * 18;
		this._canvas.height = 10 * 32 * 18;
		this._canvas.getContext("2d").imageSmoothingEnabled = false;

		this.appendChild(this._canvas);
	}

	private draw(ctx: TransformCanvasRenderingContext2D) {
		const canvas = this._canvas;
		const p1 = ctx.transformedPoint(0, 0);
		const p2 = ctx.transformedPoint(canvas.width, canvas.height);
		ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.restore();

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const zoneImage = this._zoneImages[10 * y + x];
				ctx.drawImage(zoneImage, x * 576, y * 576);
			}
		}
	}

	public disconnectedCallback() {
		super.disconnectedCallback();
	}
}

export default WorldView;
